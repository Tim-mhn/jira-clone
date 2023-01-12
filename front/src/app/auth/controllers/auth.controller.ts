import { Injectable } from '@angular/core';
import { AuthAPI } from '../apis/auth.api';
import { AuthProvidersModule } from '../auth.providers.module';

@Injectable({
  providedIn: AuthProvidersModule,
})
export class AuthController {
  constructor(private api: AuthAPI) {}

  signOut() {
    return this.api.signOut;
  }
}
