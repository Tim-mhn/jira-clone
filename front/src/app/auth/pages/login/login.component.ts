import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { InputType } from '@tim-mhn/ng-forms/input';
import { AuthController } from '../../controllers/auth.controller';
import { LoginCredentials } from '../../models/credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(
    private tfb: TypedFormBuilder,
    private controller: AuthController,
    private router: Router
  ) {}

  readonly EMAIL_INPUT = InputType.EMAIL;
  loginForm = this.tfb.group<LoginCredentials>({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  requestState = new RequestState();

  ngOnInit(): void {}

  login() {
    this.controller
      .login(this.loginForm.value, this.requestState)
      .subscribe(() => this.router.navigate(['/', 'projects']));
  }
}
