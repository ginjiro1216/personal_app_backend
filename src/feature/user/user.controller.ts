import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe, Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "../../entities/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { GetUser } from "../auth/decorator/get-usr.decorator";
import { Profile } from "../../entities/profile.entity";
import { Role } from "../auth/decorator/role.decorator";
import { UserStatus } from "../auth/user-status.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("user")
export class UserController {
  constructor(private readonly profileService: UserService) {
  }

  @Get()
  @Role(UserStatus.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<Profile[]> {
    return await this.profileService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<Profile> {
    const profile = await this.profileService.findByUserId(id);
    if (profile.user.id === user.id || user.status === "ADMIN") {
      return profile;
    } else {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

  }
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @GetUser() user: User
  ): Promise<Profile> {
    return await this.profileService.create(createProfileDto, user);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() createProfileDto: CreateProfileDto,
    @GetUser() user: User
  ): Promise<Profile> {
    const profile = await this.profileService.findByUserId(id);
    if (profile.user.id === user.id || user.status === "ADMIN") {
      return await this.profileService.update(createProfileDto, id)
    } else {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }
  }
}
