import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectSettingsComponent } from './project-settings.page';
import { ProjectSettingsUiModule } from '../components/project-settings-ui/project-settings-ui.module';
import { ProjectInvitationsProvidersModule } from '../../../../invitations/invitations.providers.module';

const routes: Routes = [
  {
    path: '',
    component: ProjectSettingsComponent,
  },
];
@NgModule({
  declarations: [ProjectSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProjectInvitationsProvidersModule,
    ProjectSettingsUiModule,
  ],
})
export class ProjectSettingsModule {}
