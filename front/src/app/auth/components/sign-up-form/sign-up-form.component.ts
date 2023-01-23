import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { InputType } from '@tim-mhn/ng-forms/input';
import { PASSWORD_VALIDATION_ERRORS } from '../../constants/error-messages.constants';
import { AuthController } from '../../controllers/auth.controller';
import { SignUpForm } from '../../models/sign-up';
import { PasswordValidator } from '../../validators/password.validator';

@Component({
  selector: 'jira-sign-up-form',
  templateUrl: './sign-up-form.component.html',
})
export class SignUpFormComponent implements OnInit {
  constructor(
    private tfb: TypedFormBuilder,
    private controller: AuthController
  ) {}

  @Output() successSignUp = new EventEmitter<SignUpForm>();

  requestState = new RequestState();

  signUpForm = this.tfb.group<SignUpForm>({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', PasswordValidator],
  });

  readonly EMAIL_INPUT: InputType.EMAIL;
  readonly PASSWORD_VALIDATION_ERROR_MESSAGES = PASSWORD_VALIDATION_ERRORS;
  ngOnInit(): void {}

  signUp() {
    if (this.signUpForm.valid) {
      // this.onSignUpFn(this.signUpForm.value)
      //   .pipe(this.requestStateController.handleRequest(this.requestState))
      //   .subscribe();
      this.controller
        .signUpAndLogin(this.signUpForm.value, this.requestState)
        .subscribe(() => {
          this.successSignUp.emit(this.signUpForm.value);
        });
    }
  }
}
