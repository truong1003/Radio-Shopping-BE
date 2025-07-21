// src/account/account.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './account.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  findAll() {
    return this.accountRepo.find();
  }

  async create(dto: CreateAccountDto) {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const account = this.accountRepo.create({ ...dto, password: hashedPassword });
    return this.accountRepo.save(account);
  }

  findById(id: number) {
    return this.accountRepo.findOne({ where: { id } });
  }
}
