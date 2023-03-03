import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentVariablesService {
  constructor(private config: ConfigService) {}

  getJWTSecret() {
    return this.config.get<string>('JWT_SECRET_KEY');
  }
}
