import { Injectable } from '@angular/core';
import {
  catchError,
  filter,
  of,
  startWith,
  switchMap,
  shareReplay,
} from 'rxjs';
import { ProjectMembersAPI } from '../../../core/apis/project-members.api';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';
import { DashboardSingletonsProvidersModule } from '../../../dashboard-singletons.providers.module';

@Injectable({
  providedIn: DashboardSingletonsProvidersModule,
})
export class ProjectMembersService {
  constructor(
    private projectService: CurrentProjectService,
    private api: ProjectMembersAPI
  ) {
    console.count('ProjectMembersService');
  }

  public projectMembers$ = this.projectService.currentProject$.pipe(
    catchError((err) => {
      console.error(err);
      return of(null);
    }),
    filter((id) => !!id),
    switchMap(({ Id }) => this.api.getProjectMembers(Id)),
    startWith([]),
    shareReplay()
  );
}
