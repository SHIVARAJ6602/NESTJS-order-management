import { Injectable, UnauthorizedException } from '@nestjs/common'; // Make sure to import UnauthorizedException
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CustomersService } from '../customers/customers.service'; // Correct the import to inject CustomersService
import * as bcrypt from 'bcryptjs'; // Optional: For password hashing

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private customersService: CustomersService, // Injecting CustomersService
  ) {}

  // Function to generate JWT token
  async generateToken(payload: any) {
    return this.jwtService.sign(payload, { expiresIn: '3600s' }); // You can set an expiration time
  }

  // Optional: Function to validate a password (if using password authentication)
  async validateUserPassword(storedPassword: string, inputPassword: string) {
    return bcrypt.compare(inputPassword, storedPassword); // Compare hashed passwords
  }

  // The login function
  async login(loginDto: LoginDto) {
    // Find the user by username
    const user = await this.customersService.findByCredentials(
      loginDto.id,
      loginDto.pswd,
    );

    // If the user is not found or credentials are incorrect, throw UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate the JWT payload and token
    const payload = { id: user.id, sub: user.name };
    const access_token = await this.generateToken(payload);

    return { access_token }; // Return the access token to the user
  }
}
