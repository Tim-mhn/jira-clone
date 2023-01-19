import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimPasswordInputModule } from '@tim-mhn/ng-forms/password-input';
import { SignUpUIComponent } from './sign-up.component';

@NgModule({
  declarations: [SignUpUIComponent],
  imports: [
    CommonModule,
    RouterModule,
    TimInputModule,
    TimInputFieldModule,
    ReactiveFormsModule,
    TimUIButtonModule,
    TypedFormsModule,
    TimPasswordInputModule,
  ],
  exports: [SignUpUIComponent],
})
export class SignUpUIModule {}
