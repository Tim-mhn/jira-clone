import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { ProjectSettingsUiComponent } from './project-settings-ui.component';
import { FeaturePageContainerModule } from '../../../../core/components/feature-page-container/feature-page-container.module';
import { AddMembersDialogModule } from '../add-members-dialog/add-members-dialog.module';

@NgModule({
  declarations: [ProjectSettingsUiComponent],
  imports: [
    CommonModule,
    FeaturePageContainerModule,
    AddMembersDialogModule,
    TimUIDialogModule,
  ],
  exports: [ProjectSettingsUiComponent],
})
export class ProjectSettingsUiModule {}
