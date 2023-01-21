import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { InputType } from '@tim-mhn/ng-forms/input';
import { AuthController } from '../../controllers/auth.controller';
import { SignUpForm } from '../../models/sign-up';

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
    password: ['', Validators.required],
  });

  readonly EMAIL_INPUT: InputType.EMAIL;

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
