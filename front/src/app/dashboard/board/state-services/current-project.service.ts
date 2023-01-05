import { Injectable } from '@angular/core';
import { ReplaySubject, tap } from 'rxjs';
import { Project } from '../../core/models/project';
import { BoardContentProvidersModule } from '../board-providers.module';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CurrentProjectService {
  constructor() {}

  private _currentProject$ = new ReplaySubject<Project>();
  readonly currentProject$ = this._currentProject$
    .asObservable()
    .pipe(tap((p) => (this._currentProject = p)));

  private _currentProject: Project;

  public updateCurrentProject(p: Project) {
    this._currentProject$.next(p);
  }

  public get currentProject() {
    return this._currentProject;
  }
}
