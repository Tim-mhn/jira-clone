import { Injectable } from '@angular/core';
import { ReplaySubject, tap } from 'rxjs';
import { logMethod } from '../../../shared/utils/log-method.decorator';
import { Project } from '../../core/models/project';
import { BoardContentProvidersModule } from '../board-providers.module';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CurrentProjectService {
  constructor() {
    console.log('current project service created');
  }

  private _currentProject$ = new ReplaySubject<Project>();
  readonly currentProject$ = this._currentProject$
    .asObservable()
    .pipe(tap((p) => (this._currentProject = p)));

  private _currentProject: Project;

  @logMethod
  public updateCurrentProject(p: Project) {
    this._currentProject$.next(p);
  }

  public get currentProject() {
    return this._currentProject;
  }
}
