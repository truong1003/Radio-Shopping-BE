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
import { CustomerStatus } from 'src/types/type';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Brand, (brand) => brand.customers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone_number: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 255, nullable: true })
  tags: string;

  @Column({ length: 255, nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
  })
  status: CustomerStatus;

  @Column({ type: 'float', nullable: true })
  order_amount: number | null;

  @Column({ length: 255 })
  brand_favorite: string;

  @Column({ nullable: true, type: 'varchar' })
  product: string | null;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
