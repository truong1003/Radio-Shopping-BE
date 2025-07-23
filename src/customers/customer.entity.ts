import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from 'src/brands/brand.entity';
import { CustomerStatus, Role } from 'src/types/type';

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

  @Column({
    type: 'enum',
    enum: CustomerStatus,
  })
  status: CustomerStatus;

  @Column({ length: 255, nullable: true })
  brand_favorite: string;

  @Column({ type: 'int', default: 0 })
  orders: number;

  @Column({ type: 'int', default: 0 })
  number_of_call: number;

  @Column({ default: false })
  deleted: boolean;
}
