import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { HomePage } from './pages/home-page/home.page';
import { NonDashboardPageContainerModule } from '../shared/components/non-dashboard-page-container/non-dashboard-page-container.module';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NonDashboardPageContainerModule,
    TimUIButtonModule,
  ],
})
export class HomeModule {}
