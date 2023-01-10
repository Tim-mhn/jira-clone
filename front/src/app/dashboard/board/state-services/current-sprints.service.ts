import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SprintWithTasks } from '../../core/models/sprint';
import { BoardContentProvidersModule } from '../board-providers.module';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CurrentSprintsService {
  constructor() {}

  private _sprintList$ = new ReplaySubject<SprintWithTasks[]>();
  public sprintList$ = this._sprintList$.asObservable();

  public updateSprintList(sprints: SprintWithTasks[]) {
    this._sprintList$.next(sprints);
  }
}
