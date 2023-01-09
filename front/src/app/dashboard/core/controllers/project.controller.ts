import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { GetTasksAPI } from '../apis/get-tasks.api';
import { SingleProjectAPI } from '../apis/single-project.api';
import { TaskStatusAPI } from '../apis/task-status.api';
import { ProjectMapper } from '../mappers/project.mapper';
import { Project } from '../models/project';
import { Task } from '../models/task';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class ProjectController {
  constructor(
    private projectApi: SingleProjectAPI,
    private taskStatusApi: TaskStatusAPI,
    private getTasksApi: GetTasksAPI,
    private mapper: ProjectMapper
  ) {}

  getProject(projectId: string): Observable<Project> {
    const tasksBySprints$ =
      this.getTasksApi.getTasksGroupedBySprints(projectId);
    const allTaskStatus$ = this.taskStatusApi.getAllTaskStatus(projectId);
    const projectInfo$ = this.projectApi.getProject(projectId);

    return forkJoin({
      projectInfo: projectInfo$,
      allTaskStatus: allTaskStatus$,
      tasksBySprints: tasksBySprints$,
    }).pipe(
      map(({ projectInfo, allTaskStatus, tasksBySprints }) => {
        const sprintsTasks = tasksBySprints.map(({ Sprint, Tasks }) => ({
          Sprint,
          Tasks: Tasks.map((t) => new Task(t)),
        }));

        const { Id, Name, Members } = projectInfo;

        const projectData: Project = {
          Id,
          Name,
          Members,
          AllTaskStatus: allTaskStatus,
          Sprints: sprintsTasks,
        };
        return projectData;
      })
    );
  }
}
