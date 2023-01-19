import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { SignUpUIModule } from '../../components/sign-up-ui/sign-up.module';

const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
  },
];
@NgModule({
  declarations: [SignUpComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SignUpUIModule],
})
export class SignUpModule {}
