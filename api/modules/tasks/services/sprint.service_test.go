package tasks_services

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type _TestSprint struct {
	Name         string
	Backlog      bool
	CreationTime time.Time
}

func (s _TestSprint) IsBacklog() bool {
	return s.Backlog
}

func (s _TestSprint) CreatedOn() time.Time {
	return s.CreationTime
}
func TestMoveBacklogSprintAtTheEnd(t *testing.T) {
	decemberSprint := _TestSprint{
		Name:         "Sprint 1",
		Backlog:      false,
		CreationTime: time.Date(2022, 12, 1, 1, 0, 0, 0, time.Local),
	}

	backlog := _TestSprint{
		Name:         "Backlog sprint",
		Backlog:      true,
		CreationTime: time.Date(2023, 1, 1, 1, 0, 0, 0, time.Local),
	}
	februarySprint := _TestSprint{
		Name:         "Sprint 2",
		Backlog:      false,
		CreationTime: time.Date(2022, 2, 1, 1, 0, 0, 0, time.Local),
	}

	julySprint := _TestSprint{
		Name:         "Sprint 3",
		Backlog:      false,
		CreationTime: time.Date(2022, 7, 1, 1, 0, 0, 0, time.Local),
	}

	var sprints = []_TestSprint{decemberSprint, backlog, februarySprint, julySprint}

	sortedSprints := moveBacklogSprintAtTheEnd(sprints)

	expectedSortedSprints := []_TestSprint{decemberSprint, julySprint, februarySprint, backlog}

	assert.EqualValues(t, sortedSprints, expectedSortedSprints, "it should sort sprints by descending creationDate and move backlog at the end regardless")

}

type MockSprintRepository struct {
	mock.Mock
}

func (repo *MockSprintRepository) GetActiveSprintsOfProject(projectID string) ([]tasks_models.SprintInfo, error) {
	return []tasks_models.SprintInfo{}, nil
}

func (repo *MockSprintRepository) CreateSprint(name string, projectID string) (string, error) {
	return "", nil
}
func (repo *MockSprintRepository) DeleteSprint(sprintID string) error {
	return nil
}
func (repo *MockSprintRepository) UpdateSprint(sprintID tasks_models.SprintID, sprintName tasks_models.SprintName) tasks_errors.SprintError {
	args := repo.Called(sprintID, sprintName)
	return args.Get(0).(tasks_errors.SprintError)
}
func (repo *MockSprintRepository) MarkSprintAsCompleted(sprintID string) error {
	return nil
}

func (repo *MockSprintRepository) GetSprintInfo(sprintID string) (tasks_models.SprintInfo, tasks_errors.SprintError) {
	args := repo.Called(sprintID)
	return args.Get(0).(tasks_models.SprintInfo), tasks_errors.NoSprintError()
}

func TestUpdateSprintName(t *testing.T) {
	t.Run("it should return a SprintNotFound error if sprint is not returned by the repo", func(t *testing.T) {
		service := new(SprintService)
		mockRepo := new(MockSprintRepository)
		service.sprintRepo = mockRepo

		returnsNonBacklogSprintOnGetSprintInfo(mockRepo)

		sprintNotFoundError := tasks_errors.BuildSprintError(tasks_errors.SprintNotFound, fmt.Errorf("not found"))
		mockRepo.On("UpdateSprint", mock.Anything, mock.Anything).Return(sprintNotFoundError)

		err := service.UpdateSprintName("sprint-id", "new name")

		assert.Equal(t, tasks_errors.SprintNotFound, err.Code, "should return SprintNotFound")

	})

	t.Run("should call repo.UpdateSprint with the right params", func(t *testing.T) {
		service := new(SprintService)
		mockRepo := new(MockSprintRepository)
		service.sprintRepo = mockRepo

		sprintNotFoundError := tasks_errors.BuildSprintError(tasks_errors.SprintNotFound, fmt.Errorf("not found"))
		returnsNonBacklogSprintOnGetSprintInfo(mockRepo)
		mockRepo.On("UpdateSprint", mock.Anything, mock.Anything).Return(sprintNotFoundError)

		sprintID := "this-is-the-sprint-id"
		newName := "sprint's new name"
		service.UpdateSprintName(sprintID, newName)

		mockRepo.AssertCalled(t, "UpdateSprint", sprintID, newName)

	})

	t.Run("should return UnauthorizedToChangeBacklogSprint error if trying to change a backlog sprint", func(t *testing.T) {
		service := new(SprintService)
		mockRepo := new(MockSprintRepository)
		service.sprintRepo = mockRepo

		backlogSprint := tasks_models.SprintInfo{
			Id:        "a",
			Name:      "backlog",
			IsBacklog: true,
		}
		mockRepo.On("GetSprintInfo", mock.Anything).Return(backlogSprint)

		sprintID := "this-is-the-sprint-id"
		newName := "sprint's new name"
		err := service.UpdateSprintName(sprintID, newName)

		mockRepo.AssertNotCalled(t, "UpdateSprint")
		assert.Equal(t, tasks_errors.UnauthorizedToChangeBacklogSprint, err.Code)

	})
}

func returnsNonBacklogSprintOnGetSprintInfo(repo *MockSprintRepository) {
	nonBacklogSprint := tasks_models.SprintInfo{
		Id:        "a",
		Name:      "sprint 1",
		IsBacklog: false,
	}

	repo.On("GetSprintInfo", mock.Anything).Return(nonBacklogSprint)
}
