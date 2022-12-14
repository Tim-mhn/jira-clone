import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TaskListComponent } from './task-list.component';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [TaskListComponent],
})
export class TaskListModule {}
