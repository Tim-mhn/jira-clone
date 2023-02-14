import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TaskTagsController } from './task-tags.controller';
import { TaskTagsAPI } from './task-tags.api';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [TaskTagsAPI, TaskTagsController],
})
export class TagsModule {}
