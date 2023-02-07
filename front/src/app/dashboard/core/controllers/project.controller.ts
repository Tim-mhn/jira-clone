import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { SingleProjectAPI } from '../apis/single-project.api';
import { TaskStatusAPI } from '../apis/task-status.api';
import { Project } from '../models/project';
import { TaskTypeAPI } from '../apis/task-type.api';
import { ProjectMembers } from '../models';
import { ProjectMembersAPI } from '../apis/project-members.api';
import { ProjectMemberMapper } from '../mappers/sprint.mapper copy';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectController {
  constructor(
    private projectApi: SingleProjectAPI,
    private membersAPI: ProjectMembersAPI,
    private taskStatusApi: TaskStatusAPI,
    private taskTypesApi: TaskTypeAPI,
    private membersMapper: ProjectMemberMapper
  ) {}

  getProject(projectId: string): Observable<Project> {
    const allTaskStatus$ = this.taskStatusApi.getAllTaskStatus(projectId);
    const projectInfo$ = this.projectApi.getProject(projectId);
    const taskTypes$ = this.taskTypesApi.getAllTaskType(projectId);
    return forkJoin({
      projectInfo: projectInfo$,
      allTaskStatus: allTaskStatus$,
      taskTypes: taskTypes$,
    }).pipe(
      map(({ projectInfo, allTaskStatus, taskTypes }) => {
        const projectData: Project = {
          ...projectInfo,
          AllTaskStatus: allTaskStatus,
          TaskTypes: taskTypes,
        };
        return projectData;
      })
    );
  }

  getProjectMembers(projectId: string): Observable<ProjectMembers> {
    return this.membersAPI
      .getProjectMembers(projectId)
      .pipe(map((dtoList) => this.membersMapper.toDomain(dtoList)));
  }
}
