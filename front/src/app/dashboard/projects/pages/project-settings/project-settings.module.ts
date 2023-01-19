import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectSettingsComponent } from './project-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectSettingsComponent,
  },
];
@NgModule({
  declarations: [ProjectSettingsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProjectSettingsModule {}
