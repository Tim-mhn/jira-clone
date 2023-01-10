import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { logMethod } from '../../../shared/utils/log-method.decorator';
import { SprintWithTasks } from '../../core/models/sprint';
import { BoardContentProvidersModule } from '../board-providers.module';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CurrentSprintsService {
  constructor() {}

  private _sprintList$ = new ReplaySubject<SprintWithTasks[]>();
  public sprintList$ = this._sprintList$.asObservable();

  @logMethod
  public updateSprintList(sprints: SprintWithTasks[]) {
    this._sprintList$.next(sprints);
  }
}
