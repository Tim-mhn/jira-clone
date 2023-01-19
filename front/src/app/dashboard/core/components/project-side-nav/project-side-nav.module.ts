import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectSideNavComponent } from './project-side-nav.component';

@NgModule({
  declarations: [ProjectSideNavComponent],
  imports: [CommonModule, RouterModule],
  exports: [ProjectSideNavComponent],
})
export class ProjectSideNavModule {}
