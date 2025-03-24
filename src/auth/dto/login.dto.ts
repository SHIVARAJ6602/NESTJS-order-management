import { IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'The unique ID of the customer' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'The password for the customer account' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  pswd: string;
}
