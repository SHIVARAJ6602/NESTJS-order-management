import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomersModule } from '../customers/customers.module'; 

@Module({
  imports: [
    ConfigModule.forRoot(),  // Add ConfigModule to load environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],  // Import ConfigModule for async loading
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // Use env variable for the secret key
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '3600s') }, // Default expiration if not defined
      }),
    }),
    CustomersModule,
  ],
  providers: [AuthService, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
