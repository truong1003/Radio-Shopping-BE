// src/account/account.service.ts
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './account.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/types/type';

const SALT_ROUNDS = 10;
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  findAll() {
    return this.accountRepo.find({ where: { role: Role.user } });
  }

  async create(dto: CreateAccountDto) {
    try {
      const existing = await this.accountRepo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new BadRequestException('Email đã tồn tại');
      }

      const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

      const account = this.accountRepo.create({ ...dto, password: hashedPassword });
      return await this.accountRepo.save(account);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Account creation failed:', error);
      throw new InternalServerErrorException('Tạo tài khoản thất bại');
    }
  }

  findById(id: number) {
    return this.accountRepo.findOne({ where: { id } });
  }
}
