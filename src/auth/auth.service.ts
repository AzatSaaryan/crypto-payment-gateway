import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppJwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: AppJwtService,
  ) {}

  async registerUser(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) throw new ConflictException('User already exists');

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await this.prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true, createdAt: true, updatedAt: true },
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
}
