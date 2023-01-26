import { NgModule } from '@angular/core';
import { TimUISnackbarModule } from '@tim-mhn/ng-ui/snackbar';
import { SnackbarFeedbackService } from '../../shared/services/snackbar-feedback.service';

@NgModule({
  imports: [TimUISnackbarModule],
  providers: [SnackbarFeedbackService],
})
export class DashboardCoreProvidersModule {}
