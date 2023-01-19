import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SingleProjectPagesLayoutComponent } from './single-project-pages-layout.component';
import { ProjectSideNavModule } from '../project-side-nav/project-side-nav.module';

@NgModule({
  declarations: [SingleProjectPagesLayoutComponent],
  imports: [CommonModule, ProjectSideNavModule, RouterModule],
  exports: [SingleProjectPagesLayoutComponent],
})
export class SingleProjectPagesLayoutModule {}
