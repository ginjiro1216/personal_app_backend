import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserStatus } from "./user-status.enum";

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashPassword, status: UserStatus.NORMAL});

    await this.save(user);
    delete user.password;
    return user;
  }
}
