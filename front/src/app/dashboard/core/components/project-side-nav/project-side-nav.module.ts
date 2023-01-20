import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectSideNavComponent } from './project-side-nav.component';
import { SideNavItemComponent } from './side-nav-item/side-nav-item.component';

@NgModule({
  declarations: [ProjectSideNavComponent, SideNavItemComponent],
  imports: [CommonModule, RouterModule],
  exports: [ProjectSideNavComponent],
})
export class ProjectSideNavModule {}
