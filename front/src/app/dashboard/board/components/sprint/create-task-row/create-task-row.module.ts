import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateTaskRowComponent } from './create-task-row.component';

@NgModule({
  declarations: [CreateTaskRowComponent],
  imports: [
    CommonModule,
    TimInputModule,
    TypedFormsModule,
    ReactiveFormsModule,
  ],
  exports: [CreateTaskRowComponent],
})
export class CreateTaskRowModule {}
