import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardBreadcrumbComponent } from './board-breadcrumb.component';

@NgModule({
  declarations: [BoardBreadcrumbComponent],
  imports: [CommonModule, RouterModule],
  exports: [BoardBreadcrumbComponent],
})
export class BoardBreadcrumbModule {}
