/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariablesService } from '../environment/environment-variables.service';
import { AuthenticatedRequestUser } from './authenticated-request';
import { JWTPayload } from './jwt-payload';

const AUTHORIZATION_COOKIE_NAME = 'Authorization';
export const cookieExtractor = (req: any) => {
  try {
    const cookies = (req?.headers?.cookie as string)?.split(/;( )?/);

    const authCookie = cookies?.find((cookie) => {
      const [name, _] = cookie.split('=');
      return name === AUTHORIZATION_COOKIE_NAME;
    });

    const jwt = authCookie?.split('=')?.[1];
    console.log('jwt = ', jwt);
    return jwt;
  } catch (err) {
    console.error(`[JwtStrategy] Error in cookieExtractor: ${err}`);
    return null;
  }
};
// ...
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envVariables: EnvironmentVariablesService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: envVariables.getJWTSecret(),
    });
  }

  async validate(payload: JWTPayload): Promise<AuthenticatedRequestUser> {
    return { id: payload.data.Id, name: payload.data.Name };
  }
}
