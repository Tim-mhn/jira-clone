package sprints

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/utils/primitives"
)

func TestServiceUpdateSprint(t *testing.T) {
	t.Run("it should return a SprintNotFound error if sprint is not returned by the repo", func(t *testing.T) {
		service := new(SprintService)
		mockRepo := new(MockSprintRepository)
		service.sprintRepo = mockRepo

		returnsNonBacklogSprintOnGetSprintInfo(mockRepo)

		var updateSprint = UpdateSprint{
			Name: primitives.CreateStringPointer("new name"),
		}

		sprintNotFoundError := BuildSprintError(SprintNotFound, fmt.Errorf("not found"))
		mockRepo.On("UpdateSprint", mock.Anything, mock.Anything).Return(sprintNotFoundError)

		err := service.UpdateSprintIfNotBacklog("sprint-id", updateSprint)

		assert.Equal(t, SprintNotFound, err.Code, "should return SprintNotFound")

	})

	t.Run("should call repo.UpdateSprint with the right params", func(t *testing.T) {
		service := new(SprintService)
		mockRepo := new(MockSprintRepository)
		service.sprintRepo = mockRepo

		sprintNotFoundError := BuildSprintError(SprintNotFound, fmt.Errorf("not found"))
		returnsNonBacklogSprintOnGetSprintInfo(mockRepo)
		mockRepo.On("UpdateSprint", mock.Anything, mock.Anything).Return(sprintNotFoundError)
		newName := "sprint's new name"

		updateSprint := UpdateSprint{
			Name: primitives.CreateStringPointer(newName),
		}
		sprintID := "this-is-the-sprint-id"
		service.UpdateSprintIfNotBacklog(sprintID, updateSprint)

		mockRepo.AssertCalled(t, "UpdateSprint", sprintID, updateSprint)

	})

	t.Run("should return UnauthorizedToChangeBacklogSprint error if trying to change a backlog sprint", func(t *testing.T) {
		service := new(SprintService)
		mockRepo := new(MockSprintRepository)
		service.sprintRepo = mockRepo

		backlogSprint := SprintInfo{
			Id:        "a",
			Name:      "backlog",
			IsBacklog: true,
		}
		mockRepo.On("GetSprintInfo", mock.Anything).Return(backlogSprint)

		sprintID := "this-is-the-sprint-id"
		newName := "sprint's new name"

		updateSprint := UpdateSprint{
			Name: &newName,
		}
		err := service.UpdateSprintIfNotBacklog(sprintID, updateSprint)

		mockRepo.AssertNotCalled(t, "UpdateSprint")
		assert.Equal(t, UnauthorizedToChangeBacklogSprint, err.Code)

	})
}

func returnsNonBacklogSprintOnGetSprintInfo(repo *MockSprintRepository) {
	nonBacklogSprint := SprintInfo{
		Id:        "a",
		Name:      "sprint 1",
		IsBacklog: false,
	}

	repo.On("GetSprintInfo", mock.Anything).Return(nonBacklogSprint)
}
