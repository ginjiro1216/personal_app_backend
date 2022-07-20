import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './repository/profile.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from '../../entities/profile.entity';
import { User } from '../../entities/user.entity';
import { AddressRepository } from './repository/address.repository';
import { AuthRepository } from "../auth/auth.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository,
    private readonly authRepository: AuthRepository
  ) {}
  async findAll(): Promise<Profile[]> {
    const profile = await this.profileRepository.find({
      relations: ['user', 'address'],
    });
    return profile.map((profile) => {
      delete profile.user.password;
      return profile;
    });
  }
  async findById(id: string): Promise<Profile> {
    const found = await this.profileRepository.findOne(id, {
      relations: ['address', 'user'],
    });
    if (!found) {
      throw new NotFoundException();
    }
    delete found.user.password;
    return found;
  }
  async findByUserId(id: string): Promise<User> {
    const user = await this.authRepository.findOne(id, {
      relations: ['profile', 'profile.address'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    delete user.password;
    return user;
  }
  async update(
    createProfileDto: CreateProfileDto,
    id: string,

  ): Promise<Profile> {
    const { postCode, prefecture, city, address1 } = createProfileDto;
    const user = await this.findByUserId(id);
    const addressId = user.profile.address.id
    await this.addressRepository.updateAddress(addressId, {
      postCode,
      prefecture,
      city,
      address1,
    });
    return this.profileRepository.updateProfile(user.profile.id,
      createProfileDto,
    );
  }


}
