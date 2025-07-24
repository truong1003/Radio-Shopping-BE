// src/schedule/schedule.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { LiveStatus } from 'src/types/type';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  consultant: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 50 })
  time: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  product: string;

  @Column({
    type: 'enum',
    enum: LiveStatus,
    default: LiveStatus.upcoming,
  })
  status: LiveStatus;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
