import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintComponent } from './sprint.component';
import { TaskListModule } from '../task-list/task-list.module';

@NgModule({
  declarations: [SprintComponent],
  imports: [CommonModule, TaskListModule],
  exports: [SprintComponent],
})
export class SprintModule {}
