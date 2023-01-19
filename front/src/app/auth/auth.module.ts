import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthAPI } from './apis/auth.api';
import { AuthProvidersModule } from './auth.providers.module';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'sign-up/invite',
    loadChildren: () =>
      import('./pages/sign-up-invite/sign-up-invite.module').then(
        (m) => m.SignUpInviteModule
      ),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/sign-up/sign-up.module').then((m) => m.SignUpModule),
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    AuthProvidersModule,
  ],
  providers: [AuthAPI],
})
export class AuthModule {}
