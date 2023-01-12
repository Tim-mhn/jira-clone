import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { buildSingleTaskEndpoint } from '.';
import { BoardContentProvidersModule } from '../../board/board-providers.module';
import { MoveTaskPositionDTO } from '../dtos/move-task.dto';

@Injectable({
  providedIn: BoardContentProvidersModule,
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
