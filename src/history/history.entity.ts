import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Voucher } from 'src/voucher/voucher.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Voucher, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @Column({ length: 20, nullable: true })
  phone_number: string;

  @Column({ length: 20, nullable: true })
  send_type: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  sent_at: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
