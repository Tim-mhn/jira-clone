package tasks_services

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	"github.com/tim-mhn/figma-clone/utils/primitives"
)

type MockTagService struct {
	mock.Mock
}

func (service *MockTagService) ExtractAndUpdateTagsOfTask(taskID string, htmlTitle string) error {

	args := service.Mock.Called()
	err := args.Get(0).(error)
	return err

}

func (service *MockTagService) GetTaskTagTemplate() tags.TaskTagTemplate {
	return ""

}

type MockTaskCommandsRepo struct {
	mock.Mock
}

func (repo *MockTaskCommandsRepo) CreateTask(projectID string, sprintID string, title string, assigneeID string, points int, description string) (tasks_models.Task, error) {

	args := repo.Mock.Called()

	task := args.Get(0).(tasks_models.Task)
	secondArg := args.Get(1)
	var err error = nil
	if secondArg != nil {
		err = secondArg.(error)
	}
	return task, err
}

func (repo *MockTaskCommandsRepo) UpdateTask(taskID string, patchDTO tasks_dtos.PatchTaskDTO) error {
	return nil
}

func TestCreateTask(t *testing.T) {

	t.Run("should return the error from the TagsService if it returns any", func(t *testing.T) {

		service, mockRepo, mockTagsService := setupServiceAndMocks()

		taskID := primitives.CreateStringPointer("new-task-id")
		taskTitle := primitives.CreateStringPointer("new task title")

		mockRepo.On("CreateTask").Return(tasks_models.Task{
			Id:    taskID,
			Title: taskTitle,
		}, nil)

		tagsError := fmt.Errorf("an error occurred with tags")
		mockTagsService.On("ExtractAndUpdateTagsOfTask").Return(tagsError)

		_, err := service.CreateTask(CreateTaskInput{})

		assert.EqualValues(t, tagsError, err.Source)

	})

	t.Run("should not call  ExtractAndUpdateTagsOfTask if there is an error in repo.CreateTask", func(t *testing.T) {

		service, mockRepo, mockTagsService := setupServiceAndMocks()

		newTaskError := fmt.Errorf("error when creating task")
		mockRepo.On("CreateTask").Return(tasks_models.Task{}, newTaskError)

		_, err := service.CreateTask(CreateTaskInput{})

		mockTagsService.AssertNotCalled(t, "ExtractAndUpdateTagsOfTask")
		assert.EqualValues(t, newTaskError, err.Source)

	})
}

func TestUpdateTaskAndTags(t *testing.T) {

	TASK_ID := "task-id"
	t.Run("it should not call ExtractAndUpdateTagsOfTask if title is empty", func(t *testing.T) {

		service, _, mockTagsService := setupServiceAndMocks()

		patchDTO := tasks_dtos.PatchTaskDTO{}

		service.UpdateTaskAndTags(TASK_ID, patchDTO)

		mockTagsService.AssertNotCalled(t, "ExtractAndUpdateTagsOfTask", "ExtractAndUpdateTagsOfTask should not be called if title is empty")

	})
}

func setupServiceAndMocks() (*TaskCommandsService, *MockTaskCommandsRepo, *MockTagService) {
	mockTagsService := new(MockTagService)
	mockRepo := new(MockTaskCommandsRepo)
	service := NewTaskCommandsService(mockRepo, mockTagsService)

	return service, mockRepo, mockTagsService
}
