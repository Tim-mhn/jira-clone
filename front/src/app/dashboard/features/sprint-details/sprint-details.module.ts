import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SprintPage } from './sprint-details.page';
import { SprintDetailsUiModule } from './components/sprint-details-ui/sprint-details-ui.module';

const routes: Routes = [
  {
    path: '',
    component: SprintPage,
  },
];
@NgModule({
  declarations: [SprintPage],
  imports: [CommonModule, RouterModule.forChild(routes), SprintDetailsUiModule],
})
export class SprintPageModule {}
