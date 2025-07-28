import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Product } from 'src/products/product.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Status } from 'src/types/type';
import { Voucher } from 'src/voucher/voucher.entity';
import { Customer } from 'src/customers/customer.entity';
// import { Customer } from 'src/customers/customer.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title_brand: string;

  @Column()
  phone_number: string;

  @Column({ default: 'abc' })
  tags: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.active,
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  deleted: boolean;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @OneToMany(() => Schedule, (schedule) => schedule.brand)
  schedules: Schedule[];

  @OneToMany(() => Voucher, (voucher) => voucher.brand)
  vouchers: Voucher[];

  @OneToMany(() => Customer, (customer) => customer.brand)
  customers: Customer[];
}
