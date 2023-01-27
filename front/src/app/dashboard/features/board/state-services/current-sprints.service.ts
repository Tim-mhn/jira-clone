import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SprintInfo, SprintWithTasks } from '../../../core/models';
import { DashboardSingletonsProvidersModule } from '../../../dashboard-singletons.providers.module';

@Injectable({
  providedIn: DashboardSingletonsProvidersModule,
})
export class CurrentSprintsService {
  constructor() {
    console.count('CurrentSprintsService');
  }

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
