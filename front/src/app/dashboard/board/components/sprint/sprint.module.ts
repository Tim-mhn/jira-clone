import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintComponent } from './sprint.component';
import { TaskListModule } from '../task-list/task-list.module';
import { CreateTaskRowModule } from './create-task-row/create-task-row.module';

@NgModule({
  declarations: [SprintComponent],
  imports: [CommonModule, TaskListModule, CreateTaskRowModule],
  exports: [SprintComponent],
})
export class SprintModule {}
