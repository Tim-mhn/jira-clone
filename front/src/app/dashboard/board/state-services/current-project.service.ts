import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ProjectInfo } from '../../core/models/project';
import { BoardContentProvidersModule } from '../board-providers.module';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CurrentProjectService {
  constructor() {}

  private _currentProject$ = new ReplaySubject<ProjectInfo>();
  readonly currentProject$ = this._currentProject$.asObservable();

  public updateCurrentProject(p: ProjectInfo) {
    this._currentProject$.next(p);
  }
}
