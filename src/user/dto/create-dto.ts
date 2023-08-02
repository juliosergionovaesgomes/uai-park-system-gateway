import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class UserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
