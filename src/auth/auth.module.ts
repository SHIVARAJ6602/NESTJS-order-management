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
        //secret: configService.get<string>('JWT_SECRET'),  // Use env variable for the secret key
        secret: 'f9452760852534fed90f36549f83fd5aa2789b34989a79273a9e4584b04ab030f0e3ae4267eb9d4cee005b5c1de399fa92502037aa7873fc9c86b0ec52777026',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '3600s') }, // Default expiration if not defined
      }),
    }),
    CustomersModule,
  ],
  providers: [AuthService, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
