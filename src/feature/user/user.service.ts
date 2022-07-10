import { Injectable, NotFoundException } from "@nestjs/common";
import { ProfileRepository } from "./repository/profile.repository";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { Profile } from "../../entities/profile.entity";
import { User } from "../../entities/user.entity";
import { AddressRepository } from "./repository/address.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository
  ) {
  }
  async findAll(): Promise<Profile[]> {
    const profile = await this.profileRepository.find({relations: ['user', 'address']});
    return profile.map(profile => {
      delete profile.user.password;
      return profile;
    }) ;
  }
  async findById(id: string): Promise<Profile> {
    const found = await this.profileRepository.findOne(id, {relations: ['user', 'address']});
    if (!found) {
      throw new NotFoundException();
    }
    delete found.user.password
    return found;
  }
  async create(createProfileDto: CreateProfileDto, user: User): Promise<Profile> {

    const {
      postCode,
      prefecture,
      city,
      address1
    } = createProfileDto;
    const address =　await this.addressRepository.createAddress({
      postCode,
      prefecture,
      city,
      address1,
    });
    return this.profileRepository.createProfile(createProfileDto, user, address)

  }
}
