import { ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from './skip-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any,context: ExecutionContext) {
    // Check if the route has the @SkipAuth decorator
    const isSkipAuth = this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());

    // If SkipAuth is set to true, allow the request to continue
    if (isSkipAuth) {
      return user; // Skip authentication and allow access
    }

    // If there's an error or no user, throw an UnauthorizedException
    if (err) {
      throw new UnauthorizedException(`An error occurred: ${err.message}`);
    }

    if (!user) {
      new UnauthorizedException('You are not authorized!');
    }

    return user; // Otherwise, return the authenticated user
  }
}
