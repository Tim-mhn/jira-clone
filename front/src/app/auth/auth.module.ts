import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthAPI } from './apis/auth.api';
import { AuthProvidersModule } from './auth.providers.module';
import { AuthPageLayoutComponent } from './components/auth-page-layout/auth-page-layout.component';
import { AuthPageLayoutModule } from './components/auth-page-layout/auth-page-layout.module';

const routes: Routes = [
  {
    path: '',
    component: AuthPageLayoutComponent,
    children: [
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
    ],
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
    AuthPageLayoutModule,
  ],
  providers: [AuthAPI],
})
export class AuthModule {}
