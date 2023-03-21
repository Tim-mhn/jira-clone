package tasks_services

import (
	"github.com/stretchr/testify/mock"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type MockTasksQueriesService struct {
	mock.Mock
}

func (mockService *MockTasksQueriesService) GetTasksGroupedBySprint(
	projectID string, taskFilters tasks_models.TaskFilters) (tasks_dtos.SprintListWithTasksDTO, error) {

	args := mockService.Called(projectID, taskFilters)

	var err error

	if args.Get(1) == nil {
		err = nil
	} else {
		err = args.Get(1).(error)
	}

	return args.Get(0).(tasks_dtos.SprintListWithTasksDTO), err
}

func (mockService *MockTasksQueriesService) GetTaskByID(taskID string) (tasks_models.Task, tasks_errors.TaskError) {
	args := mockService.Called(taskID)

	return args.Get(0).(tasks_models.Task), tasks_errors.NoTaskError()
}
