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
  ): Promise<{ accessToken: string }> {
    const { username, password } = credentialsDto;
    const user = await this.authRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, username: username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください。',
    );
  }
}
