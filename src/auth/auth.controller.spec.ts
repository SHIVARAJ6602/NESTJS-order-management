import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock AuthService
  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,  // Use the mocked AuthService
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.login and return JWT token on valid credentials', async () => {
    // Arrange
    const loginDto = { id: 1, pswd: 'password' };
    const mockResponse = { access_token: 'mocked-jwt-token' };

    // Mock the login method of AuthService to return the mock response
    mockAuthService.login.mockResolvedValue(mockResponse);

    // Act
    const result = await controller.login(loginDto);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto); // Ensure the login method was called with the correct parameters
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    // Arrange
    const loginDto = { id: 0, pswd: 'wrongpassword' };

    // Mock the login method of AuthService to throw UnauthorizedException
    mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

    // Act and Assert
    await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto); // Ensure the login method was called with the correct parameters
  });
});
