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
import { CustomerStatus, DiscountType } from 'src/types/type';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Brand, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ type: 'text', nullable: false })
  product_apply: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
  })
  discount_type: DiscountType;

  @Column({ type: 'float', nullable: false })
  discount_value: number;

  @Column({ type: 'date', nullable: false })
  start_date: string;

  @Column({ type: 'date', nullable: false })
  end_date: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  total_voucher: number;

  @Column({ type: 'int' })
  voucher_sended: number;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
