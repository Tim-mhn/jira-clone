import { NgModule } from '@angular/core';
import { TimHttpModule } from '@tim-mhn/common/http';
import { TimUISnackbarModule } from '@tim-mhn/ng-ui/snackbar';
import { SnackbarFeedbackService } from '../../shared/services/snackbar-feedback.service';

@NgModule({
  imports: [TimHttpModule, TimUISnackbarModule],
  providers: [SnackbarFeedbackService],
})
export class BoardContentProvidersModule {}
