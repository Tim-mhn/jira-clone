import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { InputType } from '@tim-mhn/ng-forms/input';
import { Observable } from 'rxjs';
import { SignUpForm } from '../../models/sign-up';

export type OnSignUpFn = (signUpForm: SignUpForm) => Observable<any>;

@Component({
  selector: 'jira-sign-up-ui',
  templateUrl: './sign-up.component.html',
})
export class SignUpUIComponent implements OnInit {
  constructor(
    private tfb: TypedFormBuilder,
    private router: Router,
    private requestStateController: RequestStateController
  ) {}

  @Input() onSignUpFn: OnSignUpFn;

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
      this.onSignUpFn(this.signUpForm.value)
        .pipe(this.requestStateController.handleRequest(this.requestState))
        .subscribe();
    }
  }
}
