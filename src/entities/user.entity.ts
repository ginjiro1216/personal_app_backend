import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from '../feature/auth/user-status.enum';
import { Exclude } from 'class-transformer';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  status: UserStatus;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
