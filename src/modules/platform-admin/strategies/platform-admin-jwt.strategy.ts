import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { PlatformAdminJwtPayload, RequestPlatformAdmin } from '../platform-admin.types';

// Named 'platform-jwt' (not the default 'jwt') and verified against its own
// secret (JWT_PLATFORM_ADMIN_SECRET) — entirely separate from the per-academy
// JwtStrategy, so a platform admin token can never be verified as, or
// mistaken for, an academy User's token, and vice versa.
@Injectable()
export class PlatformAdminJwtStrategy extends PassportStrategy(Strategy, 'platform-jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_PLATFORM_ADMIN_SECRET')!,
    });
  }

  async validate(payload: PlatformAdminJwtPayload): Promise<RequestPlatformAdmin> {
    // PlatformAdmin isn't tenant-scoped and this strategy runs outside any
    // resolved academy context (see the /platform exclusion in AppModule), so
    // this is a plain, unscoped lookup by id — there's no tenant to check it against.
    const admin = await this.prisma.platformAdmin.findUnique({ where: { id: payload.sub } });
    if (!admin) {
      throw new UnauthorizedException('Platform admin no longer exists');
    }
    return { adminId: admin.id, email: admin.email };
  }
}
