import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtStrategyBase } from 'passport-jwt'; // Import the base Strategy class from passport-jwt
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(JwtStrategyBase) { // Renamed class
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
      ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get<string>('JWT_SECRET') || 'f9452760852534fed90f36549f83fd5aa2789b34989a79273a9e4584b04ab030f0e3ae4267eb9d4cee005b5c1de399fa92502037aa7873fc9c86b0ec52777026',  // Use secret from environment or default
        });
      }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
