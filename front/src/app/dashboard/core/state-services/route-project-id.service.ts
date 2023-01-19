import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class RouteProjectIdService {
  constructor() {}

  private _projectId$ = new ReplaySubject<string>();
  public projectId$ = this._projectId$.asObservable();

  setProjectId(id: string) {
    this._projectId$.next(id);
  }
}
