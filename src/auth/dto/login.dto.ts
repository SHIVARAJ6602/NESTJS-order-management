import { IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class LoginDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  pswd: string;
}
