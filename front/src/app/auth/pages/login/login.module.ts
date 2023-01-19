import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimPasswordInputModule } from '@tim-mhn/ng-forms/password-input';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TimInputModule,
    TimInputFieldModule,
    ReactiveFormsModule,
    TimUIButtonModule,
    TypedFormsModule,
    TimPasswordInputModule,
  ],
})
export class LoginModule {}
