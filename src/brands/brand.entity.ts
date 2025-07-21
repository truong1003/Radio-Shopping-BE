import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title_brand: string;

  @Column()
  phone_number: string;

  @Column()
  tags: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  description: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
