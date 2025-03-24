import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './skip-auth.decorator';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Customer } from '../customers/entities/customer.entity';

@Controller('auth')
@ApiTags('Authentication') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  @ApiOperation({ summary: 'Customer login' })
  @ApiResponse({
    status: 200,
    description: 'Customer login successfully',
    schema: {
      type: 'object',
      properties: {accessToken: { type: 'string', description: 'JWT Token for authenticated access' }},
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
