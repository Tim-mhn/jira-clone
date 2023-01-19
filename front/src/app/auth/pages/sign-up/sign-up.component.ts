import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { AuthAPI } from '../../apis/auth.api';
import { OnSignUpFn } from '../../components/sign-up-ui/sign-up.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  constructor(private authAPI: AuthAPI, private router: Router) {}

  onSignUpFn: OnSignUpFn = (signUpForm) =>
    this.authAPI.signUp(signUpForm).pipe(
      tap(() => console.log('SignUpComponent')),
      switchMap(() => this.router.navigate(['auth', 'login']))
    );
}
