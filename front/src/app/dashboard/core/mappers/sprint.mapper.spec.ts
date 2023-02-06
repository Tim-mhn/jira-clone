import { TimDate } from '@tim-mhn/common/date';
import { SprintInfoDTO } from '../dtos/sprints.dtos';
import { UpdateSprint } from '../models';
import { SprintMapper } from './sprint.mapper';

describe('SprintMapper', () => {
  describe('dtoToSprintInfo', () => {
    const mapper = new SprintMapper();

    it('should return null for dates if dto is null', () => {
      const dto: SprintInfoDTO = {
        Id: '1',
        IsBacklog: false,
        Name: 'name',
        EndDate: null,
        StartDate: null,
      };

      const sprintInfo = mapper.dtoToSprintInfo(dto);

      expect(sprintInfo.StartDate).toBeNull();
      expect(sprintInfo.EndDate).toBeNull();
    });
  });

  describe('updateSprintToDTO', () => {
    const mapper = new SprintMapper();

    it('should map start/end dates to iso string', () => {
      const startDateISO = '2013-10-05T14:48:00.000Z';
      const endDateISO = '2011-10-05T14:48:00.000Z';

      const updateSprint: UpdateSprint = {
        name: 'new name',
        endDate: TimDate.fromISO(endDateISO),
        startDate: TimDate.fromISO(startDateISO),
      };

      const dto = mapper.updateSprintToDTO(updateSprint);

      expect(dto.startDate.split('T')[0]).toEqual('2013-10-05');
      expect(dto.endDate.split('T')[0]).toEqual('2011-10-05');
    });

    it('should not return start / end dates if missing', () => {
      const updateSprint: UpdateSprint = {
        name: 'new name',
      };

      const dto = mapper.updateSprintToDTO(updateSprint);

      expect(dto.startDate).toBeUndefined();
    });

    it('should not return name if missing', () => {
      const updateSprint: UpdateSprint = {
        startDate: TimDate.fromISO('2011-10-05T14:48:00.000Z'),
      };

      const dto = mapper.updateSprintToDTO(updateSprint);

      expect(dto.name).toBeUndefined();
    });
  });
});
