package tasks_services

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	"github.com/tim-mhn/figma-clone/utils/primitives"
)

func TestCreateTask(t *testing.T) {

	t.Run("should return the error from the TagsService if it returns any", func(t *testing.T) {

		service, mockRepo, mockTagsService, _ := setupServiceAndMocks()

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

		service, mockRepo, mockTagsService, _ := setupServiceAndMocks()

		newTaskError := fmt.Errorf("error when creating task")
		mockRepo.On("CreateTask").Return(tasks_models.Task{}, newTaskError)

		_, err := service.CreateTask(CreateTaskInput{})

		mockTagsService.AssertNotCalled(t, "ExtractAndUpdateTagsOfTask")
		assert.EqualValues(t, newTaskError, err.Source)

	})
}

func TestUpdateTask(t *testing.T) {

	TASK_ID := "task-id"
	project := project.Project{
		Id:   "project-id",
		Name: "project name",
	}

	t.Run("it should not call ExtractAndUpdateTagsOfTask if title is empty", func(t *testing.T) {

		service, _, mockTagsService, _ := setupServiceAndMocks()

		updateTask := UpdateTaskInput{
			TaskID:         TASK_ID,
			NewData:        tasks_dtos.PatchTaskDTO{},
			UpdatingUserID: "user-id",
			ProjectID:      "project-id",
		}

		service.UpdateTask(updateTask)

		mockTagsService.AssertNotCalled(t, "ExtractAndUpdateTagsOfTask", "ExtractAndUpdateTagsOfTask should not be called if title is empty")

	})

	t.Run("it should call notificationsAPI.SendTaskAssignationNotification if there is a new assignee", func(t *testing.T) {
		service, _, _, mockNotificationsAPI := setupServiceAndMocks()

		newAssigneeId := "new-assignee-id-xyz"
		patchDTO := tasks_dtos.PatchTaskDTO{
			AssigneeId: primitives.CreateStringPointer(newAssigneeId),
		}

		updateTask := UpdateTaskInput{
			TaskID:         TASK_ID,
			NewData:        patchDTO,
			UpdatingUserID: "user-id",
			ProjectID:      project.Id,
		}

		service.UpdateTask(updateTask)

		mockNotificationsAPI.AssertCalled(t, "SendTaskAssignationNotification", mock.Anything)

	})
}

func setupServiceAndMocks() (*TaskCommandsService, *MockTaskCommandsRepo, *MockTagService, *notifications_api.MockNotificationsAPI) {
	mockTagsService := new(MockTagService)
	mockRepo := new(MockTaskCommandsRepo)
	mockNotifications := new(notifications_api.MockNotificationsAPI)
	mockNotifications.On("SendTaskAssignationNotification", mock.Anything).Return(nil)

	service := NewTaskCommandsService(mockRepo, mockTagsService, mockNotifications)
	service.notificationsAPI = mockNotifications
	return service, mockRepo, mockTagsService, mockNotifications
}

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

func (service *MockTagService) CreateTagForProject(tag tags.TaskTag, projectID string) error {
	return nil
}

func (service *MockTagService) GetProjectTags(projectID string) ([]tags.TaskTag, error) {
	return []tags.TaskTag{}, nil
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

func (repo *MockTaskCommandsRepo) UpdateTaskData(taskID string, patchDTO tasks_dtos.PatchTaskDTO) error {
	return nil
}

func (repo *MockTaskCommandsRepo) DeleteTask(taskID string) (tasks_repositories.DeleteTaskResponse, error) {
	return tasks_repositories.DeleteTaskResponse{}, nil
}
