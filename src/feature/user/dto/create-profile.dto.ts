import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto  {
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  postCode: string;

  @IsString()
  @IsNotEmpty()
  prefecture: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address1: string;
}
