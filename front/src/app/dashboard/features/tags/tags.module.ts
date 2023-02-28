import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskTagsController } from './task-tags.controller';
import { TaskTagsAPI } from './task-tags.api';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [TaskTagsAPI, TaskTagsController],
})
export class TagsModule {}
