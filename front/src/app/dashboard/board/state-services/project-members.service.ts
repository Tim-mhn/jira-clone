import { Injectable } from '@angular/core';
import { catchError, filter, of, shareReplay, switchMap } from 'rxjs';
import { ProjectMembersAPI } from '../../core/apis/project-members.api';
import { BoardContentProvidersModule } from '../board-providers.module';
import { CurrentProjectService } from './current-project.service';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class ProjectMembersService {
  constructor(
    private projectService: CurrentProjectService,
    private api: ProjectMembersAPI
  ) {}

  public projectMembers$ = this.projectService.currentProject$.pipe(
    catchError((err) => {
      console.error(err);
      return of(null);
    }),
    filter((id) => !!id),
    switchMap(({ Id }) => this.api.getProjectMembers(Id)),
    shareReplay()
  );
}
