import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DashboardCoreProvidersModule } from '../../../core/core.providers.module';
import { SprintInfo, SprintWithTasks } from '../../../core/models/sprint';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class CurrentSprintsService {
  constructor() {}

  private _tasksGroupedBySprints$ = new ReplaySubject<SprintWithTasks[]>();
  public tasksGroupedBySprints$ = this._tasksGroupedBySprints$.asObservable();

  private _activeSprints$ = new ReplaySubject<SprintInfo[]>();
  public activeSprints$ = this._activeSprints$.asObservable();

  public updateSprintInfoList(sprints: SprintInfo[]) {
    this._activeSprints$.next(sprints);
  }

  public updateSprintList(sprints: SprintWithTasks[]) {
    this._tasksGroupedBySprints$.next(sprints);
  }
}
