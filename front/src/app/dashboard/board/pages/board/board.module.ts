import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { SingleProjectAPI } from '../../../core/apis/single-project.api';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
  },
];

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [SingleProjectAPI],
})
export class BoardModule {}
