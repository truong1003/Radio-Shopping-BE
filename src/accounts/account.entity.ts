import { Brand } from 'src/brands/brand.entity';
import { Role } from 'src/types/type';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.user,
  })
  role: Role;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  password: string;

  @OneToMany(() => Brand, (brand) => brand.account)
  brands: Brand[];
}
