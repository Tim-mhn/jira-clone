package search

import (
	"github.com/stretchr/testify/mock"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type MockSearchTasksRepository struct {
	mock.Mock
}

func (repo MockSearchTasksRepository) SearchTasksWithMatchingContentInUserProjects(input SearchInput) ([]tasks_models.TaskInfo, error) {
	args := repo.Called(mock.Anything)

	errOrNil := convertToError(args.Get(1))

	return args.Get(0).([]tasks_models.TaskInfo), errOrNil

}

type MockSearchSprintsRepository struct {
	mock.Mock
}

func (repo MockSearchSprintsRepository) SearchSprintOfUsersByName(searchInput SearchInput) ([]SprintInfo, error) {
	args := repo.Called(mock.Anything)

	errOrNil := convertToError(args.Get(1))

	return args.Get(0).([]SprintInfo), errOrNil
}

func convertToError(errorOrNil interface{}) error {
	if errorOrNil == nil {
		return nil
	}

	return errorOrNil.(error)
}
