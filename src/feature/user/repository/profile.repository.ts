import { EntityRepository, Repository } from "typeorm";
import { CreateProfileDto } from "../dto/create-profile.dto";
import { Profile } from "../../../entities/profile.entity";
import { User } from "../../../entities/user.entity";
import { Address } from "../../../entities/address.entity";
import { CreateUserDto } from "../../auth/dto/create-user.dto";

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  async createProfile(
    createUserDto: CreateUserDto,
    user: User,
    address: Address,
  ): Promise<Profile> {
    const { lastName, firstName, email, phoneNumber } = createUserDto;

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
    return await this.findOne(id, {
      relations: ['address'],
    })
  }

}
