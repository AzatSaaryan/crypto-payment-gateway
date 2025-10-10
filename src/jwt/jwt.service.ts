import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { jwtConstants } from './jwt.constants';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AppJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async signAccessToken(payload: JwtPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: jwtConstants.accessTtl,
    });

    return accessToken;
  }

  async signRefreshToken(payload: JwtPayload): Promise<void> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshTtl,
    });

    await this.redis.set(
      `refresh:${payload.sub}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: jwtConstants.accessSecret,
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: jwtConstants.refreshSecret,
    });
  }
}
