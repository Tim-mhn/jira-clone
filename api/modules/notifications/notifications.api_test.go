package notifications_api

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
	"github.com/tim-mhn/figma-clone/utils/primitives"
)

func TestCreateCommentNotification(t *testing.T) {

	notificationsBaseUrlFn = func() string {
		return "notifications.api"
	}

	mockClient := new(http_utils.MockHTTPClient)
	httpClient = mockClient

	projectID := "project-id-123"
	taskID := "task-id-xyz"

	mockRequest := http_utils.BuildRequest(http_utils.GET, "url", nil)

	var dto NewCommentNotificationDTO

	buildRequestFn = func(method http_utils.HTTPMethod, url string, body interface{}) *http.Request {
		dto = body.(NewCommentNotificationDTO)
		return mockRequest
	}

	project := project.Project{
		Id:   projectID,
		Name: "my project's name",
	}

	t.Run("it should correctly map the input to the dto with the outputs of project and task repos", func(t *testing.T) {

		notificationsAPI, mockProjectRepo, mockTaskRepo := setupServiceWithMocks()

		task := tasks_models.TaskWithSprint{
			Task: tasks_models.Task{
				Id:    primitives.CreateStringPointer(taskID),
				Title: primitives.CreateStringPointer("title of task"),
			},
			Sprint: sprints.SprintInfo{},
		}

		mockProjectRepo.On("GetProjectByID", mock.Anything).Return(project)
		mockTaskRepo.On("GetTaskByID", mock.Anything).Return(task, tasks_errors.NoTaskError())
		mockClient.On("Do", mock.Anything).Return(http_utils.NewMockHTTPResponse(), nil)
		input := CreateCommentNotificationInput{
			TaskID:    taskID,
			Comment:   "this is a comment",
			ProjectID: projectID,
			Author: CommentAuthor{
				Name: "Bob",
				ID:   "x12oz-con-12ce-1c",
			},
		}
		notificationsAPI.CreateCommentNotification(input, &http.Cookie{})

		expectedDTO := NewCommentNotificationDTO{
			Task: NotificationTaskDTO{
				Id:   taskID,
				Name: *task.Title,
			},
			Comment: input.Comment,
			Author:  input.Author,
			Project: ProjectIdName{
				Name: project.Name,
				ID:   project.Id,
			},
		}

		assert.EqualValues(t, expectedDTO, dto)
	})

	t.Run("it should remove the tags from the task title", func(t *testing.T) {
		notificationsAPI, mockProjectRepo, mockTaskRepo := setupServiceWithMocks()
		titleWithTags := tags.BuildTitleWithTags(tags.TaskTitleParts{
			tags.TaskTitlePart{
				Text:  "this is",
				IsTag: false,
			},
			tags.TaskTitlePart{
				Text:  "featureTag",
				IsTag: true,
			}, tags.TaskTitlePart{
				Text:  "the title",
				IsTag: false,
			},
		})

		task := tasks_models.TaskWithSprint{
			Task: tasks_models.Task{
				Id:    primitives.CreateStringPointer(taskID),
				Title: primitives.CreateStringPointer(titleWithTags),
			},
			Sprint: sprints.SprintInfo{},
		}

		mockProjectRepo.On("GetProjectByID", mock.Anything).Return(project)
		mockTaskRepo.On("GetTaskByID", mock.Anything).Return(task, tasks_errors.NoTaskError())
		mockClient.On("Do", mock.Anything).Return(http_utils.NewMockHTTPResponse(), nil)
		input := CreateCommentNotificationInput{
			TaskID:    taskID,
			Comment:   "this is a comment",
			ProjectID: projectID,
			Author: CommentAuthor{
				Name: "Bob",
				ID:   "x12oz-con-12ce-1c",
			},
		}
		notificationsAPI.CreateCommentNotification(input, &http.Cookie{})

		assert.EqualValues(t, "this is  the title", dto.Task.Name)

	})
}

func TestSendTaskAssignationNotification(t *testing.T) {
	notificationsBaseUrlFn = func() string {
		return "notifications.api"
	}

	mockClient := new(http_utils.MockHTTPClient)
	httpClient = mockClient

	projectID := "project-id-123"
	taskID := "task-id-xyz"

	mockRequest := http_utils.BuildRequest(http_utils.GET, "url", nil)

	project := project.Project{
		Id:   projectID,
		Name: "my project's name",
	}

	var taskAssignationDTO AssignationNotificationDTO

	buildRequestFn = func(method http_utils.HTTPMethod, url string, body interface{}) *http.Request {
		taskAssignationDTO = body.(AssignationNotificationDTO)
		return mockRequest
	}
	t.Run("it should correctly map the input to the TaskAssignationDTO with the outputs of project and task repos", func(t *testing.T) {

		notificationsAPI, mockProjectRepo, mockTaskRepo := setupServiceWithMocks()

		task := tasks_models.TaskWithSprint{
			Task: tasks_models.Task{
				Id:    primitives.CreateStringPointer(taskID),
				Title: primitives.CreateStringPointer("title of task"),
			},
			Sprint: sprints.SprintInfo{},
		}

		mockProjectRepo.On("GetProjectByID", mock.Anything).Return(project)
		mockTaskRepo.On("GetTaskByID", mock.Anything).Return(task, tasks_errors.NoTaskError())
		mockClient.On("Do", mock.Anything).Return(http_utils.NewMockHTTPResponse(), nil)
		input := SendAssignationNotificationInput{
			TaskID:     taskID,
			ProjectID:  projectID,
			AssigneeID: "assignee-id-1234",
		}

		notificationsAPI.SendTaskAssignationNotification(input, &http.Cookie{})

		expectedDTO := AssignationNotificationDTO{
			Task: NotificationTaskDTO{
				Id:   *task.Id,
				Name: *task.Title,
			},
			AssigneeID: input.AssigneeID,
			Project: ProjectIdName{
				Name: project.Name,
				ID:   project.Id,
			},
		}

		assert.EqualValues(t, expectedDTO, taskAssignationDTO)
	})
}

func setupServiceWithMocks() (NotificationsAPI, *project.MockProjectQueriesRepository, *tasks_repositories.MockTaskQueriesRepository) {
	mockProjectRepo := new(project.MockProjectQueriesRepository)
	mockTaskRepo := new(tasks_repositories.MockTaskQueriesRepository)
	notificationsAPI := NewNotificationsAPI(mockProjectRepo, mockTaskRepo)

	return notificationsAPI, mockProjectRepo, mockTaskRepo
}
