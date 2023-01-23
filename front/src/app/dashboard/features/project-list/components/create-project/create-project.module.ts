import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateProjectButtonComponent } from './create-project-button/create-project-button.component';
import { CreateProjectDialogComponent } from './create-project-dialog/create-project-dialog.component';
import { SharedDirectivesModule } from '../../../../../shared/directives/shared-directives.module';
import { DialogContainerModule } from '../../../../../shared/components/dialog-container/dialog-container.module';

@NgModule({
  declarations: [CreateProjectButtonComponent, CreateProjectDialogComponent],
  imports: [
    CommonModule,
    TimUIButtonModule,
    TimUIDialogModule,
    SharedDirectivesModule,
    DialogContainerModule,
    TypedFormsModule,
    TimInputModule,
    TimInputFieldModule,
    ReactiveFormsModule,
  ],
  exports: [CreateProjectButtonComponent],
})
export class CreateProjectModule {}
