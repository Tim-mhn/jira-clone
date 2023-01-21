import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { SignUpFormModule } from '../../components/sign-up-form/sign-up-form.module';
import { AuthDirectivesModule } from '../../directives/auth-directives.module';

const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
  },
];
@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SignUpFormModule,
    AuthDirectivesModule,
  ],
})
export class SignUpModule {}
