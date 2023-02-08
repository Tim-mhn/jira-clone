import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sprints/:sprintId',
    loadChildren: () =>
      import('../sprint-details/sprint-details.module').then(
        (m) => m.SprintPageModule
      ),
  },
  {
    path: 'tasks/:taskId',
    loadChildren: () =>
      import(
        '../task-details/pages/task-details-page/task-details-page.module'
      ).then((m) => m.TaskDetailsPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class BrowseRoutingModule {}
