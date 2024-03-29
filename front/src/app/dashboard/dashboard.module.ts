import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DashboardLayoutComponent } from './core/components/dashboard-layout/dashboard-layout.component';
import { DashboardLayoutModule } from './core/components/dashboard-layout/dashboard-layout.module';
import { DashboardCoreProvidersModule } from './core/core.providers.module';
import { DashboardSingletonsProvidersModule } from './dashboard-singletons.providers.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    loadChildren: () =>
      import('./dashboard-content.module').then(
        (m) => m.DashboardContentModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    DashboardLayoutModule,
    DashboardCoreProvidersModule,
    DashboardSingletonsProvidersModule,
  ],
})
export class DashboardModule {}
