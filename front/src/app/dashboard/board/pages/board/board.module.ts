import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { SingleProjectAPI } from '../../../core/apis/single-project.api';
import { BoardUiModule } from '../../components/board-ui/board-ui.module';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
  },
];

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), BoardUiModule],
  providers: [SingleProjectAPI],
})
export class BoardModule {}
