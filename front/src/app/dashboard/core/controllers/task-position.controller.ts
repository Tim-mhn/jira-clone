import { Injectable } from '@angular/core';
import { TaskPositionAPI } from '../apis/task-position.api';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { MoveTaskPositionDTO } from '../dtos/move-task.dto';
import { CurrentProjectService } from '../state-services/current-project.service';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class TaskPositionController {
  constructor(
    private api: TaskPositionAPI,
    private currentProjectService: CurrentProjectService
  ) {}

  moveTaskInSprint(
    dtoWithoutProjectId: Omit<MoveTaskPositionDTO, 'projectId'>
  ) {
    const dto: MoveTaskPositionDTO = {
      ...dtoWithoutProjectId,
      projectId: this._currentProjectId,
    };

    return this.api.moveTaskInSprint(dto);
  }
  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
