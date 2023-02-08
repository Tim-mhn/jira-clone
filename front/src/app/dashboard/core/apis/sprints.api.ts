import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import {
  SprintDTO,
  SprintInfoDTO,
  UpdateSprintDTO,
} from '../dtos/sprints.dtos';
import { ProjectId } from '../models';
import { buildSingleSprintsEndpoint, buildSprintsEndpoint } from './endpoints';

export type SprintProjectIds = { sprintId: string; projectId: string };
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

  deleteSprint(deleteSprintInput: SprintProjectIds) {
    const { projectId, sprintId } = deleteSprintInput;
    const endpoint = buildSingleSprintsEndpoint({ projectId, sprintId });

    return this.http.delete<void>(endpoint);
  }

  completeSprint(input: SprintProjectIds) {
    return this._updateSprintCompletedStatus(input, true);
  }

  private _updateSprintCompletedStatus(
    input: SprintProjectIds,
    completed: boolean
  ) {
    const { projectId, sprintId } = input;
    const endpoint = `${buildSingleSprintsEndpoint({
      projectId,
      sprintId,
    })}/complete`;

    const body = {
      completed,
    };

    return this.http.post<void>(endpoint, body);
  }

  reactiveSprint(input: SprintProjectIds) {
    return this._updateSprintCompletedStatus(input, false);
  }

  getActiveSprints(projectId: ProjectId): Observable<SprintInfoDTO[]> {
    const endpoint = buildSprintsEndpoint({ projectId });
    return this.http.get<SprintInfoDTO[]>(endpoint);
  }

  updateSprint(
    ids: { projectId: string; sprintId: string },
    dto: UpdateSprintDTO
  ) {
    const { projectId, sprintId } = ids;
    const endpoint = buildSingleSprintsEndpoint({
      projectId,
      sprintId,
    });

    return this.http.patch<void>(endpoint, dto);
  }

  getSprint(ids: { sprintId: string; projectId: string }) {
    const endpoint = buildSingleSprintsEndpoint(ids);

    return this.http.get<SprintDTO>(endpoint);
  }
}
