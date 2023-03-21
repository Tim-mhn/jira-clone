package tasks_services

import (
	"database/sql"
	"log"
	"sync"
	"time"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"

	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type ITasksQueriesService interface {
	GetTasksGroupedBySprint(projectID string, taskFilters tasks_models.TaskFilters) (tasks_dtos.SprintListWithTasksDTO, error)
	GetTaskById(taskID string) (tasks_models.Task, tasks_errors.TaskError)
}

type TasksQueriesService struct {
	taskRepo         *tasks_repositories.TaskQueriesRepository
	sprintRepo       sprints.SprintRepository
	sprintPointsRepo *sprints.SprintPointsRepository
}

func NewTasksQueriesService(taskRepo *tasks_repositories.TaskQueriesRepository, sprintRepo sprints.SprintRepository, sprintPointsRepo *sprints.SprintPointsRepository) ITasksQueriesService {
	return &TasksQueriesService{
		taskRepo:         taskRepo,
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func NewTasksQueriesServiceFromConn(conn *sql.DB) ITasksQueriesService {

	userRepo := auth.NewUserRepository(conn)
	taskRepo := tasks_repositories.NewTaskQueriesRepository(userRepo, conn)
	sprintRepo := sprints.NewSprintRepository(conn)
	sprintPointsRepo := sprints.NewSprintPointsRepository(conn)

	return &TasksQueriesService{
		taskRepo:         taskRepo,
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func (service *TasksQueriesService) GetTasksGroupedBySprint(projectID string, taskFilters tasks_models.TaskFilters) (tasks_dtos.SprintListWithTasksDTO, error) {
	sprintList, err := service.sprintRepo.GetActiveSprintsOfProject(projectID)

	if err != nil {
		return tasks_dtos.SprintListWithTasksDTO{}, err
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

	var sprintListWithTasks tasks_dtos.SprintListWithTasksDTO

	for sprintWithTasks := range sprintWithTasksChan {
		sprintListWithTasks = append(sprintListWithTasks, sprintWithTasks)
	}

	sprintListWithTasks = moveBacklogSprintAtTheEnd(sprintListWithTasks)

	return sprintListWithTasks, nil
}

func (service *TasksQueriesService) GetTaskById(taskID string) (tasks_models.Task, tasks_errors.TaskError) {
	taskWithSprint, err := service.taskRepo.GetTaskById(taskID)

	if err.HasError {
		return tasks_models.Task{}, err
	}

	return taskWithSprint.Task, tasks_errors.NoTaskError()
}

func (service TasksQueriesService) getSprintTasksAndPointsBreakdown(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.TaskWithSprint, sprints.SprintPointsBreakdown, error) {

	var syncGroup sync.WaitGroup
	tasksChan := make(chan []tasks_models.TaskWithSprint)
	pointsChan := make(chan sprints.SprintPointsBreakdown)

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
		if pointsError.HasError {
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
		return nil, sprints.SprintPointsBreakdown{}, err
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
