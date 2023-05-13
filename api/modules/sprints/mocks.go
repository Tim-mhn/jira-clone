package sprints

import (
	"github.com/stretchr/testify/mock"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

type MockSprintRepository struct {
	mock.Mock
}

func (repo *MockSprintRepository) GetActiveSprintsOfProject(projectID string) ([]SprintInfo, error) {
	args := repo.Called(projectID)

	errorOrNil := tests_utils.CastToErrorIfNotNil(args.Get(1))
	return args.Get(0).([]SprintInfo), errorOrNil
}

func (repo *MockSprintRepository) CreateSprint(name string, projectID string) (string, error) {
	args := repo.Called(name, projectID)
	return args.Get(0).(string), tests_utils.CastToErrorIfNotNil(args.Get(1))
}
func (repo *MockSprintRepository) DeleteSprint(sprintID string) error {
	return nil
}
func (repo *MockSprintRepository) UpdateSprint(sprintID SprintID, updateSprint UpdateSprint) SprintError {
	args := repo.Called(sprintID, updateSprint)
	return args.Get(0).(SprintError)
}
func (repo *MockSprintRepository) UpdateCompletedStatus(sprintID string, completed bool) error {
	return nil
}

func (repo *MockSprintRepository) GetSprintInfo(sprintID string) (SprintInfo, SprintError) {
	args := repo.Called(sprintID)
	return args.Get(0).(SprintInfo), NoSprintError()
}
