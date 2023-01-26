import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PROJECTS_API_ENDPOINT } from './endpoints';
import { ProjectInfoList } from '../models/project';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { ProjectMember } from '../models';
import { objectHasOnlyNullOrEmptyStringValues } from '../../../shared/utils/object.util';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectListAPI {
  constructor(private http: HttpClient) {}

  getUserProjects() {
    return this.http.get<ProjectInfoList>(PROJECTS_API_ENDPOINT).pipe(
      map((projects) =>
        projects.map((p) => ({
          ...p,
          Creator: this._nullifyCreatorIfNoValues(p?.Creator),
        }))
      )
    );
  }

  private _nullifyCreatorIfNoValues(creator: ProjectMember): ProjectMember {
    return objectHasOnlyNullOrEmptyStringValues(creator) ? null : creator;
  }
}
