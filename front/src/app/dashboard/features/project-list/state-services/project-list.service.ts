import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ProjectInfoList } from '../../../core/models';
import { ProjectListProvidersModule } from '../project-list-providers.module';

@Injectable({
  providedIn: ProjectListProvidersModule,
})
export class ProjectListService {
  private _projectList$ = new ReplaySubject<ProjectInfoList>();
  projectList$: Observable<ProjectInfoList> = this._projectList$.asObservable();

  updateProjectList(list: ProjectInfoList) {
    this._projectList$.next(list);
  }
}
