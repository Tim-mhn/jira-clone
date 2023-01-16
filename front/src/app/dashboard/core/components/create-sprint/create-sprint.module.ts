import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';

import { ReactiveFormsModule } from '@angular/forms';
import { CreateSprintButtonComponent } from './create-sprint-button/create-sprint-button.component';
import { CreateSprintDialogComponent } from './create-sprint-dialog/create-sprint-dialog.component';

@NgModule({
  declarations: [CreateSprintButtonComponent, CreateSprintDialogComponent],
  imports: [
    CommonModule,
    TimUIDialogModule,
    TimUIButtonModule,
    TypedFormsModule,
    TimInputModule,
    TimInputFieldModule,
    ReactiveFormsModule,
  ],
  exports: [CreateSprintButtonComponent],
})
export class CreateSprintModule {}
