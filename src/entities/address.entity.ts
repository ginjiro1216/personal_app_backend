import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postCode: string;

  @Column()
  prefecture: string;

  @Column()
  city: string;

  @Column()
  address1: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @OneToOne(() => Profile)
  profile: Profile;
}
