import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardSideNavComponent } from './board-side-nav.component';

@NgModule({
  declarations: [BoardSideNavComponent],
  imports: [CommonModule, RouterModule],
  exports: [BoardSideNavComponent],
})
export class BoardSideNavModule {}
