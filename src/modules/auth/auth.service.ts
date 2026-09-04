import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly accessTokenJwt: JwtService;
  private readonly refreshTokenJwt: JwtService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.accessTokenJwt = new JwtService({
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      signOptions: { expiresIn: this.config.get<string>('JWT_ACCESS_TTL') },
    });
    this.refreshTokenJwt = new JwtService({
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      signOptions: { expiresIn: this.config.get<string>('JWT_REFRESH_TTL') },
    });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });

    if (!user || user.deletedAt || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private buildPayload(user: {
    id: string;
    email: string;
    roles: { role: { name: string; permissions: { permission: { key: string } }[] } }[];
  }): JwtPayload {
    const roles = user.roles.map((r) => r.role.name);
    const permissions = Array.from(
      new Set(user.roles.flatMap((r) => r.role.permissions.map((p) => p.permission.key))),
    );
    return { sub: user.id, email: user.email, roles, permissions };
  }

  async login(email: string, password: string): Promise<{
    tokens: TokenPair;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
      mustChangePassword: boolean;
    };
  }> {
    const user = await this.validateCredentials(email, password);
    const payload = this.buildPayload(user);
    const tokens = await this.issueTokens(payload);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: payload.roles,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  private async issueTokens(payload: JwtPayload): Promise<TokenPair> {
    const accessToken = await this.accessTokenJwt.signAsync(payload);
    const refreshToken = await this.refreshTokenJwt.signAsync({ sub: payload.sub });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let decoded: { sub: string };
    try {
      decoded = await this.refreshTokenJwt.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
      include: {
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });

    if (!user || !user.refreshTokenHash || user.status !== 'ACTIVE' || user.deletedAt) {
      throw new UnauthorizedException('Session expired, please log in again');
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      // Possible token reuse/theft: revoke the session defensively.
      await this.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash: null } });
      throw new ForbiddenException('Refresh token invalid, session revoked');
    }

    const payload = this.buildPayload(user);
    const tokens = await this.issueTokens(payload);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
  }

  getAccessTokenVerifier(): JwtService {
    return this.accessTokenJwt;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always behave the same whether or not the account exists, so the
    // response can't be used to enumerate registered emails.
    if (!user || user.deletedAt || user.status !== 'ACTIVE') {
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      }),
      this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      }),
    ]);

    const appUrl = this.config.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173';
    const resetLink = `${appUrl}/reset-password?token=${rawToken}`;

    // No email provider is wired up yet: log the link so it can be used
    // manually in development until real delivery is added.
    this.logger.log(`Password reset requested for ${user.email}: ${resetLink}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset link');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash, refreshTokenHash: null, mustChangePassword: false },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, refreshTokenHash: null, mustChangePassword: false },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles.map((r) => r.role.name),
      mustChangePassword: user.mustChangePassword,
    };
  }
}
