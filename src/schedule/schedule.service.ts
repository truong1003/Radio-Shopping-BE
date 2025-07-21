import * as dayjs from 'dayjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository } from 'typeorm';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { Brand } from 'src/brands/brand.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateScheduleDto) {
    const brand = await this.brandRepo.findOneBy({ title_brand: dto.title_brand });
    if (!brand) throw new NotFoundException('Brand not found');

    // const formattedDate = dayjs(dto.date, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const schedule = this.repo.create({
      date: dto.date,
      time: dto.time,
      consultant: dto.consultant,
      product: dto.product,
      title: dto.title,
      brand,
    });
    return this.repo.save(schedule);
  }

  findAll() {
    return this.repo.find({ relations: ['brand'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['brand'] });
  }

  async update(id: number, dto: UpdateScheduleDto) {
    const schedule = await this.repo.findOneBy({ id });
    if (!schedule) throw new NotFoundException('Schedule not found');

    Object.assign(schedule, dto);
    return this.repo.save(schedule);
  }

  async remove(id: number) {
    const schedule = await this.repo.findOneBy({ id });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return this.repo.remove(schedule);
  }
}
