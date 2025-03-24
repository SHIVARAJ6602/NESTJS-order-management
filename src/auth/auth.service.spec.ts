import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';  // Make sure AuthController is imported
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from '../customers/customers.service';  // Adjust path if necessary
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // Mock JwtService
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),  // Mock sign method to return a mock token
  };

  // Mock CustomersService
  const mockCustomersService = {
    findByCredentials: jest.fn().mockResolvedValue({
      id: 1,
      name: 'John Doe',
      pswd: 'hashed-password',
    }), // Mock method for finding a customer by credentials
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],  // Include AuthController in the testing module
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,  // Use the mocked JwtService
        },
        {
          provide: CustomersService,
          useValue: mockCustomersService,  // Use the mocked CustomersService
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();  // Test if AuthController is defined
  });

  it('should call generateToken and return JWT token', async () => {
    const loginDto = { id: 1, pswd: 'password' };
    
    // Call the login method
    const result = await controller.login(loginDto);

    // Check if the JwtService.sign method was called
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      { id: 1, sub: 'John Doe' },
      { expiresIn: '3600s' }
    );

    // Check if the result contains a valid token
    expect(result.access_token).toBe('mocked-jwt-token');
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    // Mock invalid credentials response
    mockCustomersService.findByCredentials.mockResolvedValue(null);

    const loginDto = { id: 0, pswd: 'wrongpassword' };

    // Check if UnauthorizedException is thrown for invalid credentials
    await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
  });
});
