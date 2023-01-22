import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { ReactiveFormsModule } from '@angular/forms';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimPasswordInputModule } from '@tim-mhn/ng-forms/password-input';
import { TimUILinkModule } from '@tim-mhn/ng-ui/link';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form.component';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    RouterModule,
    TimInputModule,
    TimInputFieldModule,
    ReactiveFormsModule,
    TimUIButtonModule,
    TypedFormsModule,
    TimPasswordInputModule,
    TimUILinkModule,
  ],
  exports: [LoginFormComponent],
})
export class LoginFormModule {}
