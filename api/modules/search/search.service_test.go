package search

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

func TestSearchTasksOrSprintsOfUserByText(t *testing.T) {

	t.Run("it should successfully return a result (and not timeout) when the 2 repos return a successful result", func(t *testing.T) {

		mockTasksRepo := new(MockSearchTasksRepository)
		mockSprintsRepo := new(MockSearchSprintsRepository)
		service := NewSearchService(mockTasksRepo, mockSprintsRepo)

		searchInput := SearchInput{
			UserID: "some-user-id",
			Text:   "fix css",
		}

		taskList := []tasks_models.TaskInfo{
			{
				Points: 1,
				Id:     "task-1",
				Title:  "Fix css of header",
			},
		}

		var NO_ERROR error = nil
		sprintList := []SprintInfo{}

		mockTasksRepo.On("SearchTasksWithMatchingContentInUserProjects", mock.Anything).Return(taskList, NO_ERROR)

		mockSprintsRepo.On("SearchSprintOfUsersByName", mock.Anything).Return(sprintList, NO_ERROR)

		searchResults, err := service.searchTasksOrSprintsOfUserByText(searchInput)

		assert.Nil(t, err)
		assert.Equal(t, 1, len(searchResults.Tasks))

	})

	t.Run("it should return an error if the 2 repos return an error", func(t *testing.T) {
		mockTasksRepo := new(MockSearchTasksRepository)
		mockSprintsRepo := new(MockSearchSprintsRepository)
		service := NewSearchService(mockTasksRepo, mockSprintsRepo)

		searchInput := SearchInput{}

		tasksError := fmt.Errorf("an error occurred when fetching the task list")
		sprintsError := fmt.Errorf("an error occurred when fetching the sprint list")
		mockTasksRepo.On("SearchTasksWithMatchingContentInUserProjects", mock.Anything).Return([]tasks_models.TaskInfo{}, tasksError)

		mockSprintsRepo.On("SearchSprintOfUsersByName", mock.Anything).Return([]SprintInfo{}, sprintsError)

		_, err := service.searchTasksOrSprintsOfUserByText(searchInput)

		assert.NotNil(t, err)

	})

	t.Run("it should not return an error if only 1 repo returns an error", func(t *testing.T) {
		mockTasksRepo := new(MockSearchTasksRepository)
		mockSprintsRepo := new(MockSearchSprintsRepository)
		service := NewSearchService(mockTasksRepo, mockSprintsRepo)

		searchInput := SearchInput{}

		tasksError := fmt.Errorf("an error occurred when fetching the task list")
		var NO_ERROR error = nil
		mockTasksRepo.On("SearchTasksWithMatchingContentInUserProjects", mock.Anything).Return([]tasks_models.TaskInfo{}, tasksError)

		mockSprintsRepo.On("SearchSprintOfUsersByName", mock.Anything).Return([]SprintInfo{
			{
				Id: "sprint-a",
			},
		}, NO_ERROR)

		_, err := service.searchTasksOrSprintsOfUserByText(searchInput)

		assert.Nil(t, err)

	})
}
