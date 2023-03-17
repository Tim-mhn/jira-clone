import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { EnvironmentVariablesService } from '../environment/environment-variables.service';

@Module({
  imports: [PassportModule, JwtModule],
  providers: [JwtStrategy, EnvironmentVariablesService],
})
export class AuthModule {}
