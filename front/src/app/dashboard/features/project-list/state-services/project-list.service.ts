import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { DashboardCoreProvidersModule } from '../../../core/core.providers.module';
import { ProjectInfoList } from '../../../core/models';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectListService {
  private _projectList$ = new ReplaySubject<ProjectInfoList>();
  projectList$: Observable<ProjectInfoList> = this._projectList$.asObservable();

  updateProjectList(list: ProjectInfoList) {
    this._projectList$.next(list);
  }
}
