import { Brand } from 'src/brands/brand.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title_product: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Brand, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
