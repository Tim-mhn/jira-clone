package search

type SearchSprintsRepository interface {
	SearchSprintOfUsersByName(searchInput SearchInput) ([]SprintInfo, error)
}

type SearchTasksRepository interface {
	SearchTasksWithMatchingContentInUserProjects(input SearchInput) ([]TaskInfo, error)
}
