import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { buildSingleTaskEndpoint } from './endpoints';
import { MoveTaskPositionDTO } from '../dtos/move-task.dto';
import { DashboardCoreProvidersModule } from '../core.providers.module';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class TaskPositionAPI {
  constructor(private http: HttpClient) {}

  moveTaskInSprint(dto: MoveTaskPositionDTO) {
    const endpoint = `${buildSingleTaskEndpoint(dto)}/move`;

    const { previousTaskId, nextTaskId } = dto;

    const body = {
      previousTaskId: previousTaskId || '',
      nextTaskId: nextTaskId || '',
    };
    return this.http.patch<void>(endpoint, body);
  }
}
