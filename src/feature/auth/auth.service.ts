import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.authRepository.createUser(createUserDto);
  }
  async signIn(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string; is_admin: boolean; profileID: string}> {
    const { username, password } = credentialsDto;
    const user = await this.authRepository.findOne({ username: username}, {relations: ['profile']} );
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, username: username };
      const accessToken = await this.jwtService.sign(payload);
      const is_admin = user.status === 'ADMIN';
      const profileID = user.profile ? user.profile.id : ''
      return { accessToken, is_admin, profileID };
    }
    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください。',
    );
  }
}
