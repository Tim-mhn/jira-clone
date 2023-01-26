import { Injectable } from '@angular/core';
import { Mapper } from '../../../shared/mappers';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { TaskDTO } from '../dtos/task.dto';
import { ITask, Task } from '../models';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class TaskMapper implements Mapper<Task, TaskDTO> {
  toDomain(dto: ITask): Task {
    return new Task(dto);
  }

  mapTaskList(dtoList: TaskDTO[]) {
    return dtoList?.map((t) => this.toDomain(t)) || [];
  }
}
