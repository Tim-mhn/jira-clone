package search

import (
	"log"
	"sync"
)

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

	tasksChan := make(chan []TaskInfo)
	sprintsChan := make(chan []SprintInfo)
	errorChan := make(chan error)

	var wg sync.WaitGroup

	wg.Add(2)

	go func() {
		tasks, tasksError := service.repo.SearchTasksWithMatchingContentInUserProjects(searchInput)
		if tasksError != nil {
			errorChan <- tasksError
			log.Print(tasksError)
		}
		tasksChan <- tasks
		wg.Done()
	}()

	go func() {

		sprints, sprintsError := service.sprintRepo.SearchSprintOfUsersByName(searchInput)
		if sprintsError != nil {
			errorChan <- sprintsError
			log.Print(sprintsError)
		}
		sprintsChan <- sprints
		wg.Done()
	}()
	tasks := <-tasksChan
	sprints := <-sprintsChan
	err := <-errorChan
	errorChan <- nil
	wg.Wait()

	searchResults := SearchResults{
		Tasks:   tasks,
		Sprints: sprints,
	}

	return searchResults, err
}
