import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardLayoutComponent } from './board-layout.component';
import { BoardSideNavModule } from '../board-side-nav/board-side-nav.module';

@NgModule({
  declarations: [BoardLayoutComponent],
  imports: [CommonModule, BoardSideNavModule, RouterModule],
})
export class BoardLayoutModule {}
