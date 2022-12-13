import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ProjectWithMembersAndTasks } from '../../core/models/project';
import { BoardContentProvidersModule } from '../board-providers.module';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CurrentProjectService {
  constructor() {}

  private _currentProject$ = new ReplaySubject<ProjectWithMembersAndTasks>();
  readonly currentProject$ = this._currentProject$.asObservable();

  public updateCurrentProject(p: ProjectWithMembersAndTasks) {
    this._currentProject$.next(p);
  }
}
