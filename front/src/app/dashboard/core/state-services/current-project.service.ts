import { Injectable } from '@angular/core';
import { ReplaySubject, tap } from 'rxjs';
import { Project } from '../models/project';
import { DashboardCoreProvidersModule } from '../core.providers.module';

// todo: check why 2 instances are created with Task-Details page :(())
@Injectable({ providedIn: DashboardCoreProvidersModule })
export class CurrentProjectService {
  constructor() {
    console.count('CurrentProjectService');
  }

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
