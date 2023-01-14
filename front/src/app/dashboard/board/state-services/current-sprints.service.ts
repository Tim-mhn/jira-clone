import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { SprintInfo, SprintWithTasks } from '../../core/models/sprint';
import { getSprintsTaskDoesNotBelongTo } from '../../core/utilts/get-other-sprints.util';
import { BoardContentProvidersModule } from '../board-providers.module';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class CurrentSprintsService {
  constructor() {}

  private _sprintList$ = new ReplaySubject<SprintWithTasks[]>();
  public sprintList$ = this._sprintList$.asObservable();

  public sprintInfoList$: Observable<SprintInfo[]> = this._sprintList$.pipe(
    map((sprintWithTasks) =>
      sprintWithTasks.map((sWithTasks) => sWithTasks.Sprint)
    )
  );

  public getSprintsTaskDoesNotBelongTo$(
    taskId: string
  ): Observable<SprintInfo[]> {
    return this._sprintList$.pipe(
      map((sprintWithTasksList) =>
        getSprintsTaskDoesNotBelongTo(taskId, sprintWithTasksList)
      )
    );
  }

  public updateSprintList(sprints: SprintWithTasks[]) {
    this._sprintList$.next(sprints);
  }
}
