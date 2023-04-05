package search

import tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"

type SearchSprintsRepository interface {
	SearchSprintOfUsersByName(searchInput SearchInput) ([]SprintInfo, error)
}

type SearchTasksRepository interface {
	SearchTasksWithMatchingContentInUserProjects(input SearchInput) ([]tasks_models.TaskInfo, error)
}
