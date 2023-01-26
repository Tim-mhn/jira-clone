import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { ProjectId, SprintInfo } from '../models';
import { buildSingleSprintsEndpoint, buildSprintsEndpoint } from './endpoints';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class SprintsAPI {
  constructor(private http: HttpClient) {}

  createSprint(createSprintInput: { sprintName: string; projectId: string }) {
    const { sprintName, projectId } = createSprintInput;
    const endpoint = buildSprintsEndpoint({ projectId });
    const body = { name: sprintName };
    return this.http
      .post<string>(endpoint, body)
      .pipe(map((sprintId) => ({ sprintId })));
  }

  deleteSprint(deleteSprintInput: { sprintId: string; projectId: string }) {
    const { projectId, sprintId } = deleteSprintInput;
    const endpoint = buildSingleSprintsEndpoint({ projectId, sprintId });

    return this.http.delete<void>(endpoint);
  }

  completeSprint(deleteSprintInput: { sprintId: string; projectId: string }) {
    const { projectId, sprintId } = deleteSprintInput;
    const endpoint = `${buildSingleSprintsEndpoint({
      projectId,
      sprintId,
    })}/complete`;

    return this.http.post<void>(endpoint, null);
  }

  getActiveSprints(projectId: ProjectId): Observable<SprintInfo[]> {
    const endpoint = buildSprintsEndpoint({ projectId });
    return this.http.get<SprintInfo[]>(endpoint);
  }
}
