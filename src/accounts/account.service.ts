// src/account/account.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  findAll(search?: string) {
    const query = this.accountRepo
      .createQueryBuilder('account')
      .where('account.role IN (:...roles)', { roles: [Role.user, Role.brand] });

    if (search?.trim()) {
      query.andWhere('(account.name LIKE :search OR account.email LIKE :search)', {
        search: `%${search}%`,
      });
    }

    return query.getMany();
  }

  findAllUser() {
    return this.accountRepo.find({ where: { role: Role.user } });
  }

  async create(dto: CreateAccountDto) {
    try {
      const existing = await this.accountRepo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new BadRequestException('Email đã tồn tại');
      }

      const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

      const account = this.accountRepo.create({
        ...dto,
        role: dto.role as Role,
        password: hashedPassword,
      });
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

  async remove(id: number) {
    const account = await this.accountRepo.findOneBy({ id });
    if (!account) throw new NotFoundException('Account not found');
    return this.accountRepo.remove(account);
  }
}
