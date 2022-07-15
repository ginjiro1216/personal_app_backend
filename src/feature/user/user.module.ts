import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileRepository } from './repository/profile.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AddressRepository } from './repository/address.repository';
import { AuthRepository } from "../auth/auth.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileRepository, AddressRepository, AuthRepository]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
