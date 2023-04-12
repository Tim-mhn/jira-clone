import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { switchMap, tap } from 'rxjs';
import { LoggedInUserService } from '../../dashboard/core/state-services/logged-in-user.service';
import { APIErrorMapper } from '../../shared/errors/api-error.mapper';
import { AuthAPI } from '../apis/auth.api';
import { AuthProvidersModule } from '../auth.providers.module';
import { LoginCredentials, SignUpCredentials } from '../models/credentials';

@Injectable({
  providedIn: AuthProvidersModule,
})
export class AuthController {
  constructor(
    private api: AuthAPI,
    private requestStateController: RequestStateController,
    private loggedInUserService: LoggedInUserService,
    private router: Router,
    private errorMapper: APIErrorMapper
  ) {}

  fetchCurrentUserOrGoBackToLogin() {
    return this._getCurrentUserOrFetchFromAPI().pipe(
      tap({
        next: (u) => this.loggedInUserService.setLoggedInUser(u),
        error: (err) => {
          console.error(err);
          this.router.navigate(['/auth', 'login']);
        },
      })
    );
  }

  private _getCurrentUserOrFetchFromAPI() {
    return this.loggedInUserService.isLoggedIn$.pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn) return this.loggedInUserService.user$;
        return this.fetchAndUpdateCurrentUser();
      })
    );
  }

  fetchAndUpdateCurrentUser() {
    return this.api.me().pipe(
      tap({
        next: (u) => this.loggedInUserService.setLoggedInUser(u),
      })
    );
  }
  signOut() {
    return this.api
      .signOut()
      .pipe(tap(() => this.loggedInUserService.setNoUser()));
  }

  signUpAndLogin(credentials: SignUpCredentials, requestState?: RequestState) {
    return this.api.signUp(credentials).pipe(
      switchMap(() => this.api.login(credentials)),
      this.errorMapper.mapToErrorMessage,
      this.requestStateController.handleRequest(requestState)
    );
  }

  login(credentials: LoginCredentials, requestState?: RequestState) {
    return this.api
      .login(credentials)
      .pipe(
        this.errorMapper.mapToErrorMessage,
        this.requestStateController.handleRequest(requestState)
      );
  }
}
