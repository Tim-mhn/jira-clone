import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIDialogModule } from '@tim-mhn/ng-ui/dialog';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { TimEmailListInputModule } from '@tim-mhn/ng-forms/email-list-input';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TimInputFieldModule } from '@tim-mhn/ng-forms/input-field';
import { InvitePeopleDialogComponent } from './invite-people-dialog/invite-people-dialog.component';
import { InvitePeopleButtonComponent } from './invite-people-button/invite-people-button.component';
import { DialogContainerModule } from '../../../shared/components/dialog-container/dialog-container.module';

@NgModule({
  declarations: [InvitePeopleButtonComponent, InvitePeopleDialogComponent],
  imports: [
    CommonModule,
    TimUIDialogModule,
    TimUIButtonModule,
    TimEmailListInputModule,
    DialogContainerModule,
    TypedFormsModule,
    ReactiveFormsModule,
    TimInputFieldModule,
  ],
  exports: [InvitePeopleButtonComponent],
})
export class InvitePeopleModule {}
