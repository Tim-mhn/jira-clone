import { NgModule } from '@angular/core';
import { TimHttpModule } from '@tim-mhn/common/http';
import { TimUISnackbarModule } from '@tim-mhn/ng-ui/snackbar';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { ProjectListAPI } from '../../core/apis/project-list.api';
import { DashboardCoreProvidersModule } from '../../core/core.providers.module';

@NgModule({
  imports: [TimHttpModule, TimUISnackbarModule, DashboardCoreProvidersModule],
  providers: [SnackbarFeedbackService, ProjectListAPI],
})
export class BoardProvidersModule {}
