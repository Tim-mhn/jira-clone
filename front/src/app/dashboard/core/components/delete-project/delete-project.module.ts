import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimUIButtonModule } from '@tim-mhn/ng-ui/button';
import { DeleteProjectButtonComponent } from './delete-project-button/delete-project-button.component';

@NgModule({
  declarations: [DeleteProjectButtonComponent],
  imports: [CommonModule, TimUIButtonModule],
  exports: [DeleteProjectButtonComponent],
})
export class DeleteProjectModule {}
