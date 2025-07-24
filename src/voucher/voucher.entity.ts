import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Brand } from 'src/brands/brand.entity';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount_percent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  @Column({ type: 'date', nullable: true })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  total_voucher: number;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
