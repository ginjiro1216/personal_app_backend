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
  async findByUserId(id: string): Promise<Profile> {
    let response;
    const found = await this.authRepository.findOne(id, {
      relations: ['profile'],
    });
    if (!found) {
      throw new NotFoundException();
    }
    delete found.password;

    if (!found.profile) {
      response = [];
    } else {
      response = found
    }

    return response;
  }
  async create(
    createProfileDto: CreateProfileDto,
    user: User,
  ): Promise<Profile> {
    const { postCode, prefecture, city, address1 } = createProfileDto;
    const address = await this.addressRepository.createAddress({
      postCode,
      prefecture,
      city,
      address1,
    });
    return this.profileRepository.createProfile(
      createProfileDto,
      user,
      address,
    );
  }
  async update(
    createProfileDto: CreateProfileDto,
    id: string,

  ): Promise<Profile> {
    const { postCode, prefecture, city, address1 } = createProfileDto;
    const profile = await this.profileRepository.findOne(id, {
      relations: ['user', 'address'],
    });
    const addressId = profile.address.id
    await this.addressRepository.updateAddress(addressId, {
      postCode,
      prefecture,
      city,
      address1,
    });
    return this.profileRepository.updateProfile(id,
      createProfileDto,
    );
  }


}
