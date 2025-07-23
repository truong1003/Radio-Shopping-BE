import * as dayjs from 'dayjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository } from 'typeorm';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { Brand } from 'src/brands/brand.entity';
import { LiveStatus } from 'src/types/type';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  getScheduleStatus(schedule: Schedule): LiveStatus {
    if (!schedule.date || !schedule.time) return LiveStatus.invalid;

    const [fromStr, toStr] = schedule.time.split('-').map((s) => s.trim());
    const from = dayjs(`${schedule.date}T${fromStr}`);
    const to = dayjs(`${schedule.date}T${toStr}`);
    const now = dayjs();

    if (!from.isValid() || !to.isValid()) return LiveStatus.invalid;
    if (now.isAfter(from) && now.isBefore(to)) return LiveStatus.live;
    if (now.isAfter(to)) return LiveStatus.confirmed;
    return LiveStatus.upcoming;
  }

  async create(dto: CreateScheduleDto) {
    const brand = await this.brandRepo.findOneBy({ title_brand: dto.title_brand });
    if (!brand) throw new NotFoundException('Brand not found');

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

  async findAll() {
    const schedules = await this.repo.find();

    for (const schedule of schedules) {
      const newStatus = this.getScheduleStatus(schedule);
      if (schedule.status !== newStatus) {
        schedule.status = newStatus;
        await this.repo.save(schedule);
      }
    }

    const sortedSchedules = await this.repo.find({ relations: ['brand'] });

    return sortedSchedules.sort((a, b) => {
      const aStart = dayjs(`${a.date}T${a.time.split('-')[0].trim()}`);
      const bStart = dayjs(`${b.date}T${b.time.split('-')[0].trim()}`);
      return aStart.diff(bStart);
    });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['brand'] });
  }

  async update(id: number, dto: Partial<UpdateScheduleDto>) {
    const brand = await this.brandRepo.findOneBy({ title_brand: dto.title_brand });
    const schedule = await this.repo.findOneBy({ id });
    if (!schedule) throw new NotFoundException('Schedule not found');

    Object.assign(schedule, { ...dto, brand });
    return this.repo.save(schedule);
  }

  async remove(id: number) {
    const schedule = await this.repo.findOneBy({ id });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return this.repo.remove(schedule);
  }
}
