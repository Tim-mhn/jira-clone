import { Injectable } from '@angular/core';
import {
  catchError,
  filter,
  of,
  startWith,
  switchMap,
  shareReplay,
  Observable,
} from 'rxjs';
import { ProjectController } from '../../../core/controllers/project.controller';
import { ProjectMembers } from '../../../core/models';
import { CurrentProjectService } from '../../../core/state-services/current-project.service';
import { DashboardSingletonsProvidersModule } from '../../../dashboard-singletons.providers.module';

@Injectable({
  providedIn: DashboardSingletonsProvidersModule,
})
export class ProjectMembersService {
  constructor(
    private projectService: CurrentProjectService,
    private controller: ProjectController
  ) {
    console.count('ProjectMembersService');
  }

  public projectMembers$: Observable<ProjectMembers> =
    this.projectService.currentProject$.pipe(
      catchError((err) => {
        console.error(err);
        return of(null);
      }),
      filter((id) => !!id),
      switchMap(({ Id }) => this.controller.getProjectMembers(Id)),
      startWith([]),
      shareReplay()
    );
}
