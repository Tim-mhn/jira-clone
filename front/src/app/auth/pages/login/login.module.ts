import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthPageLayoutModule } from '../../components/auth-page-layout/auth-page-layout.module';
import { AuthDirectivesModule } from '../../directives/auth-directives.module';
import { LoginFormModule } from '../../components/login-form/login-form.module';

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
    LoginFormModule,
    AuthPageLayoutModule,
    AuthDirectivesModule,
  ],
})
export class LoginModule {}
