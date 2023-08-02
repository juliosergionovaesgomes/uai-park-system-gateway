import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
