import {
  BadRequestException,
  ConflictException,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AppJwtService } from '../jwt/jwt.service';
import { JwtPayload } from '../jwt/types/jwt-payload.type';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: AppJwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async registerUser(
    email: string,
    password: string,
    username: string,
  ): Promise<{ token: string }> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) throw new ConflictException('User already exists');

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await this.prisma.user.create({
        data: { email, passwordHash, username },
      });

      const payload = { sub: newUser.id, email: newUser.email };

      const accessToken = await this.jwt.signAccessToken(payload);
      await this.jwt.signRefreshToken(payload);

      return { token: accessToken };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user)
        throw new ConflictException("User doesn't exist. Please register");

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      const payload = { sub: user.id, email: user.email };

      const accessToken = await this.jwt.signAccessToken(payload);
      const refreshToken = await this.jwt.signRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('User login error:', error);
      throw error;
    }
  }

  async logoutUser(authHeader: string): Promise<{ message: string }> {
    if (!authHeader)
      throw new UnauthorizedException('Authorization header is missing');

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwt.verifyAccessToken(token);
      const userId = payload.sub;
      const deleted = await this.jwt.deleteRefreshToken(userId);

      if (!deleted)
        throw new BadRequestException(
          'Refresh token not found or already invalidated',
        );

      return { message: 'Logged out successfully' };
    } catch (error) {
      console.error('User logout error', error);
      throw error;
    }
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: JwtPayload;

    try {
      payload = await this.jwt.verifyRefreshToken(refreshToken);
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const storedToken = await this.redis.get(`refresh:${payload.sub}`);

    if (!storedToken || storedToken !== refreshToken)
      throw new UnauthorizedException('Refresh token not recognized');

    const accessToken = await this.jwt.signAccessToken({
      sub: payload.sub,
      email: payload.email,
    });
    const newRefreshToken = await this.jwt.signRefreshToken({
      sub: payload.sub,
      email: payload.email,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
