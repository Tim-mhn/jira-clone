import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypedFormsModule } from '@tim-mhn/common/typed-forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TimAutocompleteModule } from '@tim-mhn/ng-forms/autocomplete';
import { CreateTaskRowComponent } from './create-task-row.component';
import { TagsModule } from '../../../../tags/tags.module';

@NgModule({
  declarations: [CreateTaskRowComponent],
  imports: [
    CommonModule,
    TimAutocompleteModule,
    TypedFormsModule,
    ReactiveFormsModule,
    TagsModule,
  ],
  exports: [CreateTaskRowComponent],
})
export class CreateTaskRowModule {}
