import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { objectKeys } from '@tim-mhn/common/objects';
import { PROJECTS_API_ENDPOINT } from './endpoints';
import { BoardContentProvidersModule } from '../../features/board/board-providers.module';
import { TasksGroupedBySprintsDTO } from '../dtos/tasks-grouped-by-sprint.dto';
import { BoardFilters } from '../models/board-filters';

@Injectable({
  providedIn: BoardContentProvidersModule,
})
export class GetTasksAPI {
  constructor(private http: HttpClient) {}

  getTasksGroupedBySprints(projectId: string, filters?: BoardFilters) {
    const params = buildQueryParams(filters);
    const endpoint = `${PROJECTS_API_ENDPOINT}/${projectId}/sprints`;
    return this.http.get<TasksGroupedBySprintsDTO>(endpoint, {
      params,
    });
  }
}

export function buildQueryParams(filters?: BoardFilters): any {
  const noFilters = !filters || Object.keys(filters)?.length === 0;

  if (noFilters) return {};

  const filtersKey = objectKeys(filters);

  const params = {} as any;

  filtersKey.forEach((key) => {
    const keyAsString = key as keyof BoardFilters & string;
    const hasFilterValue = filters[keyAsString]?.length > 0;
    const keyWithArray = `${keyAsString}[]` as const;
    if (hasFilterValue) params[keyWithArray] = filters[keyAsString];
  });

  return params;
}
