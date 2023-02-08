package search

type SearchService struct {
	repo       *SearchTasksRepository
	sprintRepo *SearchSprintsRepository
}

func NewSearchService(repo *SearchTasksRepository, sprintRepo *SearchSprintsRepository) *SearchService {
	return &SearchService{
		repo:       repo,
		sprintRepo: sprintRepo,
	}
}

func (service *SearchService) searchTasksOrSprintsOfUserByText(searchInput SearchInput) (SearchResults, error) {

	tasks, tasksError := service.repo.SearchTasksWithMatchingContentInUserProjects(searchInput)
	sprints, sprintsError := service.sprintRepo.SearchSprintOfUsersByName(searchInput)
	searchResults := SearchResults{
		Tasks:   tasks,
		Sprints: sprints,
	}

	var err = tasksError
	if sprintsError != nil {
		err = sprintsError
	}

	return searchResults, err
}
