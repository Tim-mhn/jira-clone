import { Injectable } from '@angular/core';
import { TimDate } from '@tim-mhn/common/date';
import { concatObjectsIf } from '@tim-mhn/common/objects';
import { Mapper } from '../../../shared/mappers';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import {
  SprintDTO,
  SprintInfoDTO,
  UpdateSprintDTO,
} from '../dtos/sprints.dtos';
import { Sprint, SprintInfo, SprintProps, UpdateSprint } from '../models';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class SprintMapper implements Mapper<Sprint, SprintDTO> {
  toDomain(dto: SprintDTO): Sprint {
    const { Points, ...infoDTO } = dto;
    const sprintInfo = this.dtoToSprintInfo(infoDTO);
    const props: SprintProps = {
      ...sprintInfo,
      Points,
    };
    return new Sprint(props);
  }
  public dtoToSprintInfo(sprintDTO: SprintInfoDTO): SprintInfo {
    return {
      ...sprintDTO,
      StartDate: sprintDTO.StartDate
        ? TimDate.fromISO(sprintDTO.StartDate)
        : null,
      EndDate: sprintDTO.EndDate ? TimDate.fromISO(sprintDTO.EndDate) : null,
    };
  }

  updateSprintToDTO(updateSprint: UpdateSprint): UpdateSprintDTO {
    let dto: UpdateSprintDTO = {};

    const { endDate, name, startDate } = updateSprint;

    dto = concatObjectsIf(dto, { name }, !!name);

    dto = concatObjectsIf(dto, { startDate: startDate?.toISO() }, !!startDate);

    dto = concatObjectsIf(dto, { endDate: endDate?.toISO() }, !!endDate);

    return dto;
  }
}
