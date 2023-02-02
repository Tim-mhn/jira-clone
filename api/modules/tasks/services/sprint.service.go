package tasks_services

import (
	"log"
	"sync"
	"time"

	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"

	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type ISprintService interface {
	GetSprintListWithTasks(projectID string, taskFilters tasks_models.TaskFilters) (tasks_dtos.SprintListWithTasksDTO, error)
	UpdateSprintName(sprintID string, newName string) tasks_errors.SprintError
}

type SprintService struct {
	taskRepo         *tasks_repositories.TaskQueriesRepository
	sprintRepo       tasks_repositories.SprintRepository
	sprintPointsRepo *tasks_repositories.SprintPointsRepository
}

func NewSprintService(taskRepo *tasks_repositories.TaskQueriesRepository, sprintRepo tasks_repositories.SprintRepository, sprintPointsRepo *tasks_repositories.SprintPointsRepository) *SprintService {
	return &SprintService{
		taskRepo:         taskRepo,
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func (service *SprintService) GetActiveSprintsOfProject(projectID string) ([]tasks_models.SprintInfo, error) {
	return service.sprintRepo.GetActiveSprintsOfProject(projectID)
}

func (service *SprintService) GetSprintListWithTasks(projectID string, taskFilters tasks_models.TaskFilters) (tasks_dtos.SprintListWithTasksDTO, error) {
	sprintList, err := service.sprintRepo.GetActiveSprintsOfProject(projectID)

	if err != nil {
		return tasks_dtos.SprintListWithTasksDTO{}, err
	}

	var wg sync.WaitGroup
	wg.Add(len(sprintList))

	sprintWithTasksChan := make(chan tasks_dtos.SprintWithTasks, len(sprintList))

	for _, sprint := range sprintList {

		go func(sprint tasks_models.SprintInfo) {
			sprintTasks, pointsBreakdown, _ := service.getSprintTasksAndPointsBreakdown(sprint.Id, taskFilters)

			sprintWithTasks := tasks_dtos.SprintWithTasks{
				Tasks: sprintTasks,
				Sprint: tasks_models.Sprint{
					SprintInfo: sprint,
					Points:     pointsBreakdown,
				},
			}

			sprintWithTasksChan <- sprintWithTasks
			wg.Done()

		}(sprint)

	}

	wg.Wait()
	close(sprintWithTasksChan)

	var sprintListWithTasks tasks_dtos.SprintListWithTasksDTO

	for sprintWithTasks := range sprintWithTasksChan {
		sprintListWithTasks = append(sprintListWithTasks, sprintWithTasks)
	}

	sprintListWithTasks = moveBacklogSprintAtTheEnd(sprintListWithTasks)

	return sprintListWithTasks, nil
}

func (service SprintService) getSprintTasksAndPointsBreakdown(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.TaskWithSprint, tasks_models.SprintPointsBreakdown, error) {

	var syncGroup sync.WaitGroup
	tasksChan := make(chan []tasks_models.TaskWithSprint)
	pointsChan := make(chan tasks_models.SprintPointsBreakdown)

	var err error
	syncGroup.Add(2)

	go func() {
		tasks, tasksError := service.taskRepo.GetSprintTasks(sprintID, filters)
		if err != nil {
			err = tasksError
		}
		tasksChan <- tasks
		syncGroup.Done()
	}()

	go func() {
		pointsBreakdown, pointsError := service.sprintPointsRepo.GetSprintPointsBreakdown(sprintID)
		if pointsError != nil {
			err = pointsError
		}
		pointsChan <- pointsBreakdown
		syncGroup.Done()
	}()

	sprintTasks := <-tasksChan
	pointsBreakdown := <-pointsChan

	syncGroup.Wait()

	if err != nil {
		log.Printf(`Error when fetching tasks or points breakdown from sprint %s. Error: %s`, sprintID, err.Error())
		return nil, tasks_models.SprintPointsBreakdown{}, err
	}

	return sprintTasks, pointsBreakdown, nil
}

type HasBackLog interface {
	IsBacklog() bool
	CreatedOn() time.Time
}

func (service SprintService) UpdateSprintName(sprintID string, newName string) tasks_errors.SprintError {
	sprintInfo, _ := service.sprintRepo.GetSprintInfo(sprintID)
	if sprintInfo.IsBacklog {
		return tasks_errors.BuildSprintError(tasks_errors.UnauthorizedToChangeBacklogSprint, nil)
	}
	return service.sprintRepo.UpdateSprint(sprintID, newName)
}

func moveBacklogSprintAtTheEnd[T HasBackLog](sprints []T) []T {

	// sprint2 will be after sprint1 is output is true
	moveBacklogAtTheEndFunc := func(sprint1 T, sprint2 T) bool {

		neitherIsBacklog := !sprint1.IsBacklog() && !sprint2.IsBacklog()

		if neitherIsBacklog {
			sprint2CreatedBeforeSprint1 := sprint2.CreatedOn().Before(sprint1.CreatedOn())
			return sprint2CreatedBeforeSprint1
		}

		return sprint2.IsBacklog()

	}

	return arrays.SortWithComparison(sprints, moveBacklogAtTheEndFunc)
}
