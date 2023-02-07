import { Injectable } from '@angular/core';
import { TimDate } from '@tim-mhn/common/date';
import { Mapper } from '../../../shared/mappers';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { ProjectMemberDTO } from '../dtos/project-member.dto';
import { ProjectMember } from '../models';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class ProjectMemberMapper
  implements Mapper<ProjectMember[], ProjectMemberDTO[]>
{
  toDomain(dtoList: ProjectMemberDTO[]): ProjectMember[] {
    return dtoList?.map((memberDTO) =>
      this._mapSingleProjectMemberDTO(memberDTO)
    );
  }

  private _mapSingleProjectMemberDTO(dto: ProjectMemberDTO): ProjectMember {
    return {
      ...dto,
      JoinedOn: dto.JoinedOn ? TimDate.fromISO(dto.JoinedOn) : null,
    };
  }
}
