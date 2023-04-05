package search

import (
	"fmt"
	"sync"

	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SearchService struct {
	repo       SearchTasksRepository
	sprintRepo SearchSprintsRepository
}

func NewSearchService(repo SearchTasksRepository, sprintRepo SearchSprintsRepository) *SearchService {
	return &SearchService{
		repo:       repo,
		sprintRepo: sprintRepo,
	}
}

func (service *SearchService) searchTasksOrSprintsOfUserByText(searchInput SearchInput) (SearchResults, error) {

	tasksChan := make(chan []tasks_models.TaskInfo)
	sprintsChan := make(chan []SprintInfo)

	var wg sync.WaitGroup

	var tasksError error
	var sprintsError error
	wg.Add(2)

	go func() {
		tasks, err := service.repo.SearchTasksWithMatchingContentInUserProjects(searchInput)
		logErrorIfNotNil("SearchTasksWithMatchingContentInUserProjects", err)
		tasksError = err
		tasksChan <- tasks
		wg.Done()
	}()

	go func() {
		sprints, err := service.sprintRepo.SearchSprintOfUsersByName(searchInput)
		logErrorIfNotNil("SearchSprintOfUsersByName", err)
		sprintsError = err
		sprintsChan <- sprints
		wg.Done()
	}()
	tasks := <-tasksChan
	sprints := <-sprintsChan
	wg.Wait()

	searchResults := SearchResults{
		Tasks:   tasks,
		Sprints: sprints,
	}

	err := buildErrorIfBothTasksAndSprintsHaveError(tasksError, sprintsError)

	return searchResults, err
}

func logErrorIfNotNil(methodName string, err error) {
	if err != nil {
		fmt.Printf("[SearchService.searchTasksOrSprintsOfUserByText] An error occurred when calling %s. Details %e", methodName, err)
	}
}

func buildErrorIfBothTasksAndSprintsHaveError(tasksError error, sprintsError error) error {
	if tasksError != nil && sprintsError != nil {
		return fmt.Errorf("[SearchService.searchTasksOrSprintsOfUserByText] Error when fetching tasks and sprints. \nTasksError: %e \nSprintsError: %e", tasksError, sprintsError)
	}
	return nil
}
