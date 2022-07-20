import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials.dto';

import * as bcrypt from 'bcrypt';
import { ProfileRepository } from "../user/repository/profile.repository";
import { AddressRepository } from "../user/repository/address.repository";

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly addressRepository: AddressRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const user = await this.authRepository.createUser(createUserDto);
    const { postCode, prefecture, city, address1 } = createUserDto;
    const address = await this.addressRepository.createAddress({
      postCode,
      prefecture,
      city,
      address1,
    });
    await this.profileRepository.createProfile(
      createUserDto,
      user,
      address,
    );
  }
  async signIn(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string; is_admin: boolean; userID: string}> {
    const { username, password } = credentialsDto;
    const user = await this.authRepository.findOne({ username: username}, {relations: ['profile']} );
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, username: username };
      const accessToken = await this.jwtService.sign(payload);
      const is_admin = user.status === 'ADMIN';
      const userID = user.id
      return { accessToken, is_admin, userID };
    }
    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください。',
    );
  }

}
