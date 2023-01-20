import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimEmailListInputModule } from '@tim-mhn/ng-forms/email-list-input';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { AddMembersDialogComponent } from './add-members-dialog.component';

@NgModule({
  declarations: [AddMembersDialogComponent],
  imports: [
    CommonModule,
    TimUIButtonModule,
    TimEmailListInputModule,
    TimInputFieldModule,
    TimUIDialogModule,
    TypedFormsModule,
    ReactiveFormsModule,
  ],
})
export class AddMembersDialogModule {}
