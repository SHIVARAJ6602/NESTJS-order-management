import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_KEY = 'skipAuth'; // The key to store metadata
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
