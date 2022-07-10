import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  address: string;
}
