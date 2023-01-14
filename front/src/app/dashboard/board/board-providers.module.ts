import { NgModule } from '@angular/core';
import { TimHttpModule } from '@tim-mhn/common/http';
import { TimUISnackbarModule } from '@tim-mhn/ng-ui/snackbar';
import { SnackbarFeedbackService } from '../../shared/services/snackbar-feedback.service';
import { ProjectListAPI } from '../core/apis/project-list.api';

@NgModule({
  imports: [TimHttpModule, TimUISnackbarModule],
  providers: [SnackbarFeedbackService, ProjectListAPI],
})
export class BoardContentProvidersModule {}
