import { Injectable } from '@nestjs/common';
import { ethers, Wallet } from 'ethers';
import { encryptUtf8, decryptUtf8 } from './deposits.utils';
// import ERC20_ABI from '../abi/erc20.json';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepositsService {
  private provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);
  private USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

  constructor(private readonly prisma: PrismaService) {}

  async createDeposit(userId: string): Promise<{ walletAddress: string }> {
    try {
      const wallet = Wallet.createRandom();
      const walletAddress = wallet.address;
      const privateKey = wallet.privateKey;

      const encryptedPK = encryptUtf8(privateKey);

      await this.prisma.deposit.create({
        data: { userId, walletAddress, encryptedPK },
      });

      return { walletAddress };
    } catch (error) {
      console.error('Error creating deposit address');
      throw error;
    }
  }
}
