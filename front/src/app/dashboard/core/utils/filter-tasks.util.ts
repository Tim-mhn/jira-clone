import { objectKeys, objectValues } from '@tim-mhn/common/objects';
import { BoardFilters, Task, Tasks } from '../models';

const FILTER_TO_GET_FUNCTION: {
  [filter in keyof BoardFilters]: (t: Task) => string | number;
} = {
  assigneeId: (t: Task) => t.Assignee?.Id,
  type: (t: Task) => t.Type?.Id,
  status: (t: Task) => t.Status?.Id,
};
export function filterTasks(tasks: Tasks, filters: BoardFilters): Tasks {
  const noFilters = hasNoFilters(filters);
  if (noFilters) return tasks;

  const filtersToUse = objectKeys(filters).filter(
    (filterKey) => filters[filterKey]?.length > 0
  );

  const filteredTasks = tasks?.filter((task) => {
    const taskMatchesFilters = filtersToUse.every((filterKey) => {
      const taskValueForFilter = FILTER_TO_GET_FUNCTION[filterKey](task);
      const filterValues = filters[filterKey];
      return (<any[]>filterValues).includes(<any>taskValueForFilter);
    });

    return taskMatchesFilters;
  });

  return filteredTasks;
}

function hasNoFilters(filters: BoardFilters) {
  if (!filters) return true;

  const allFiltersAreNullOrEmptyArrays = objectValues(filters).every(
    (f) => !f || f.length === 0
  );

  return allFiltersAreNullOrEmptyArrays;
}
