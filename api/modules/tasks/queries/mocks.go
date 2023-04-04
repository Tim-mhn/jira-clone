package tasks_queries

import (
	"github.com/stretchr/testify/mock"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

type MockTasksQueriesService struct {
	mock.Mock
}

func NewMockTasksQueriesService() *MockTasksQueriesService {
	return new(MockTasksQueriesService)
}

func (repo *MockTasksQueriesService) GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.Task, error) {

	args := repo.Called(sprintID, mock.Anything)

	taskWithSprintList := args.Get(0).([]tasks_models.Task)
	err := tests_utils.CastToErrorIfNotNil(args.Get(1))

	return taskWithSprintList, err

}
func (repo *MockTasksQueriesService) GetTaskByID(taskID string) (tasks_models.Task, tasks_errors.TaskError) {
	args := repo.Called(taskID)

	task := args.Get(0).(tasks_models.Task)
	err := args.Get(1).(tasks_errors.TaskError)

	return task, err
}
