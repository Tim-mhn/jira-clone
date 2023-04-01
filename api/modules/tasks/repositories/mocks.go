package tasks_repositories

import (
	"github.com/stretchr/testify/mock"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

type MockTaskQueriesRepository struct {
	mock.Mock
}

func NewMockTaskQueriesRepository() *MockTaskQueriesRepository {
	return new(MockTaskQueriesRepository)
}

func (repo *MockTaskQueriesRepository) GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.TaskWithSprint, error) {

	args := repo.Called(sprintID, mock.Anything)

	taskWithSprintList := args.Get(0).([]tasks_models.TaskWithSprint)
	err := tests_utils.CastToErrorIfNotNil(args.Get(1))

	return taskWithSprintList, err

}
func (repo *MockTaskQueriesRepository) GetTaskByID(taskID string) (tasks_models.TaskWithSprint, tasks_errors.TaskError) {
	args := repo.Called(taskID)

	task := args.Get(0).(tasks_models.TaskWithSprint)
	err := args.Get(1).(tasks_errors.TaskError)

	return task, err
}
