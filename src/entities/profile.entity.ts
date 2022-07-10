import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { User } from "./user.entity";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;
}
