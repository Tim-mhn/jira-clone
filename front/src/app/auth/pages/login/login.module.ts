import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimPasswordInputModule } from '@tim-mhn/ng-forms/password-input';
import { TimUILinkModule } from '@tim-mhn/ng-ui/link';
import { LoginComponent } from './login.component';
import { AuthPageLayoutModule } from '../../components/auth-page-layout/auth-page-layout.module';
import { AuthDirectivesModule } from '../../directives/auth-directives.module';

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
    TimUILinkModule,
    AuthPageLayoutModule,
    AuthDirectivesModule,
  ],
})
export class LoginModule {}
