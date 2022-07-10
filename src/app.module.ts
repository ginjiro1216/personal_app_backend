import { Module } from '@nestjs/common';
import { AuthModule } from './feature/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './feature/user/user.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
