import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({
  controllers: [],
  providers: [JwtService],
})
export class JwtModule {}
