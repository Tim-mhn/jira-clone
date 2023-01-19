import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SingleProjectPagesLayoutComponent } from './single-project-pages-layout.component';
import { BoardSideNavModule } from '../../../board/components/board-side-nav/board-side-nav.module';

@NgModule({
  declarations: [SingleProjectPagesLayoutComponent],
  imports: [CommonModule, BoardSideNavModule, RouterModule],
  exports: [SingleProjectPagesLayoutComponent],
})
export class SingleProjectPagesLayoutModule {}
