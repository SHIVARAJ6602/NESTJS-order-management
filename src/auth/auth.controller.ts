import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './skip-auth.decorator'; 
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')  // Ensure you're using POST to access this route
  @SkipAuth()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

