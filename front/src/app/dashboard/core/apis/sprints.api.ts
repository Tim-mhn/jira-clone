import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BoardContentProvidersModule } from '../../features/board/board-providers.module';
import { buildSingleSprintsEndpoint, buildSprintsEndpoint } from './endpoints';

@Injectable({
  providedIn: BoardContentProvidersModule,
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
}
