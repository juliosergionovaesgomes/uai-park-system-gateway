import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  password_confirm: string;
}
