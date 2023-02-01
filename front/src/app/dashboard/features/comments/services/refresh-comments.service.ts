import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskCommentsProvidersModule } from '../comments-providers.module';

@Injectable({
  providedIn: TaskCommentsProvidersModule,
})
export class RefreshTaskCommentsService {
  constructor() {
    console.count('RefreshTaskCommentsService');
  }
  private _refreshComments$ = new Subject<void>();
  public refreshComments$ = this._refreshComments$.asObservable();

  public refreshComments() {
    this._refreshComments$.next();
  }
}
