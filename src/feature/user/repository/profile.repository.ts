import { EntityRepository, Repository } from 'typeorm';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { Profile } from '../../../entities/profile.entity';
import { User } from '../../../entities/user.entity';
import { AddressRepository } from './address.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../../../entities/address.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  async createProfile(
    createProfileDto: CreateProfileDto,
    user: User,
    address: Address,
  ): Promise<Profile> {
    const { lastName, firstName, email, phoneNumber } = createProfileDto;

    const profile = this.create({
      lastName,
      firstName,
      email,
      phoneNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user,
      address,
    });
    await this.save(profile);
    return profile;
  }
  async updateProfile(
    id: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const { lastName, firstName, email, phoneNumber } = createProfileDto;

    await this.update(id, {
      lastName,
      firstName,
      email,
      phoneNumber,
      updatedAt: new Date().toISOString(),
    });
    const profile = await this.findOne(id, {
      relations: ['user', 'address'],
    })
    delete profile.user.password;
    return profile
  }

}
