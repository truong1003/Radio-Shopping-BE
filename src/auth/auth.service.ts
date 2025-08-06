import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../accounts/account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Account | null> {
    const user = await this.accountRepo.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    return isMatch ? user : null;
  }

  login(user: Account) {
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getFindOne(user: { userId: number; role: string }) {
    return this.accountRepo.findOne({ where: { id: user.userId }, relations: ['brand'] });
  }
}
