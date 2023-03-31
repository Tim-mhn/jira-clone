import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimUILinkModule } from '@tim-mhn/ng-ui/link';
import { TimUIChipModule } from '@tim-mhn/ng-ui/chip';
import { NotFoundPage } from './not-found.page';

const routes: Routes = [
  {
    path: '',
    component: NotFoundPage,
  },
];

@NgModule({
  declarations: [NotFoundPage],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TimUILinkModule,
    TimUIChipModule,
  ],
})
export class NotFoundModule {}
