import { Controller, Post, UseGuards } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { UserFromToken } from '../auth/types/authenticated-request.interface';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@User() user: UserFromToken) {
    return this.depositsService.createDeposit(user.userId);
  }
}
