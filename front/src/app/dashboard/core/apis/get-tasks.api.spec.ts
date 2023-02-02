import { BoardFilters } from '../models/board-filters';
import { buildQueryParams } from './get-tasks.api';

describe('GetTasksAPI', () => {
  describe('buildQueryParams', () => {
    it('should return an empty object if filters is null', () => {
      expect(buildQueryParams(null)).toEqual({});
    });

    it('should return an empty object if filters is an empty object', () => {
      expect(buildQueryParams({})).toEqual({});
    });

    it('should return only return "assigneeId[]" key if there are no status / no type', () => {
      const filters: BoardFilters = {
        assigneeId: ['assignee-1'],
      };

      const queryParams = buildQueryParams(filters);

      expect(queryParams['assigneeId[]']).toEqual(filters.assigneeId);
      expect(Object.keys(queryParams).length).toEqual(1);
    });

    it('should return only return "status[]" key if there are no assigneeId / no type', () => {
      const filters: BoardFilters = {
        status: [1, 3],
      };

      const queryParams = buildQueryParams(filters);

      expect(queryParams['status[]']).toEqual(filters.status);
      expect(Object.keys(queryParams).length).toEqual(1);
    });

    it('should return only return keys for which there is at least 1 element', () => {
      const filters: BoardFilters = {
        assigneeId: ['assignee-1'],
        status: [],
      };

      const queryParams = buildQueryParams(filters);

      expect(queryParams['assigneeId[]']).toEqual(filters.assigneeId);
      expect(Object.keys(queryParams).length).toEqual(1);
    });

    it('should return type[] if there is at least 1 element', () => {
      const filters: BoardFilters = {
        assigneeId: ['assignee-1'],
        status: [],
        type: [2, 3],
      };

      const queryParams = buildQueryParams(filters);

      const expectedTaskTypeQueryParams = [2, 3];
      expect(queryParams['type[]']).toEqual(expectedTaskTypeQueryParams);
    });
  });
});
