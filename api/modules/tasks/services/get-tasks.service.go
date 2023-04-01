package tasks_services

import (
	"log"
	"sync"
	"time"

	"github.com/tim-mhn/figma-clone/modules/sprints"
	sprint_points "github.com/tim-mhn/figma-clone/modules/sprints/points"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"

	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type ITasksQueriesService interface {
	GetTaskByID(taskID string) (tasks_models.Task, tasks_errors.TaskError)
}

type TasksQueriesService struct {
	taskRepo         tasks_repositories.TaskQueriesRepository
	sprintRepo       sprints.SprintRepository
	sprintPointsRepo sprint_points.SprintPointsRepository
}

func NewTasksQueriesService(taskRepo tasks_repositories.TaskQueriesRepository, sprintRepo sprints.SprintRepository, sprintPointsRepo sprint_points.SprintPointsRepository) ITasksQueriesService {
	return &TasksQueriesService{
		taskRepo:         taskRepo,
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func (service *TasksQueriesService) GetTasksGroupedBySprint(projectID string, taskFilters tasks_models.TaskFilters) (tasks_dtos.BoardSprintsDTO, error) {
	sprintList, err := service.sprintRepo.GetActiveSprintsOfProject(projectID)

	if err != nil {
		return tasks_dtos.BoardSprintsDTO{}, err
	}

	var wg sync.WaitGroup
	wg.Add(len(sprintList))

	sprintWithTasksChan := make(chan tasks_dtos.SprintWithTasks, len(sprintList))

	for _, sprint := range sprintList {

		go func(spr sprints.SprintInfo) {
			sprintTasks, pointsBreakdown, _ := service.getSprintTasksAndPointsBreakdown(spr.Id, taskFilters)

			sprintWithTasks := tasks_dtos.SprintWithTasks{
				Tasks: sprintTasks,
				Sprint: sprints.Sprint{
					SprintInfo: spr,
					Points:     pointsBreakdown,
				},
			}

			sprintWithTasksChan <- sprintWithTasks
			wg.Done()

		}(sprint)

	}

	wg.Wait()
	close(sprintWithTasksChan)

	var sprintListWithTasks tasks_dtos.BoardSprintsDTO

	for sprintWithTasks := range sprintWithTasksChan {
		sprintListWithTasks = append(sprintListWithTasks, sprintWithTasks)
	}

	sprintListWithTasks = moveBacklogSprintAtTheEnd(sprintListWithTasks)

	return sprintListWithTasks, nil
}

func (service *TasksQueriesService) GetTaskByID(taskID string) (tasks_models.Task, tasks_errors.TaskError) {
	taskWithSprint, err := service.taskRepo.GetTaskByID(taskID)

	if err.HasError {
		return tasks_models.Task{}, err
	}

	return taskWithSprint.Task, tasks_errors.NoTaskError()
}

func (service TasksQueriesService) getSprintTasksAndPointsBreakdown(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.TaskWithSprint, sprint_points.SprintPointsBreakdown, error) {

	var syncGroup sync.WaitGroup
	tasksChan := make(chan []tasks_models.TaskWithSprint)
	pointsChan := make(chan sprint_points.SprintPointsBreakdown)

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
		return nil, sprint_points.SprintPointsBreakdown{}, err
	}

	return sprintTasks, pointsBreakdown, nil
}

type HasBackLog interface {
	IsBacklog() bool
	CreatedOn() time.Time
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
