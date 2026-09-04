import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload, RequestUser } from '../types';

// Routes a user with mustChangePassword=true may still reach — everything else
// is blocked here so the rule can't be bypassed by skipping frontend routing.
const ALLOWED_PATHS_WHEN_MUST_CHANGE_PASSWORD = [
  '/api/auth/change-password',
  '/api/auth/me',
  '/api/auth/logout',
];

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<RequestUser> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.deletedAt || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is no longer active');
    }

    if (user.mustChangePassword && !ALLOWED_PATHS_WHEN_MUST_CHANGE_PASSWORD.includes(req.path)) {
      throw new ForbiddenException('Password change required');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
      mustChangePassword: user.mustChangePassword,
    };
  }
}
