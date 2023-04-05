package notifications_api

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_queries "github.com/tim-mhn/figma-clone/modules/tasks/queries"
	"github.com/tim-mhn/figma-clone/utils/primitives"
)

func TestCreateCommentNotification(t *testing.T) {

	projectID := "project-id-123"
	taskID := "task-id-xyz"

	var dto NewCommentEventDTO

	sendNewCommentEventFn = func(commentDTO NewCommentEventDTO) error {
		dto = commentDTO
		return nil
	}

	project := project.Project{
		Id:   projectID,
		Name: "my project's name",
	}

	t.Run("it should correctly map the input to the dto with the outputs of project and task repos", func(t *testing.T) {

		notificationsAPI, mockProjectRepo, mockTaskRepo := setupServiceWithMocks()

		task := tasks_models.Task{
			Id:    primitives.CreateStringPointer(taskID),
			Title: primitives.CreateStringPointer("title of task"),
		}

		mockProjectRepo.On("GetProjectByID", mock.Anything).Return(project)
		mockTaskRepo.On("GetTaskByID", mock.Anything).Return(task, tasks_errors.NoTaskError())
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

		expectedDTO := NewCommentEventDTO{
			Task: NotificationTaskDTO{
				Id:    taskID,
				Title: *task.Title,
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

		task := tasks_models.Task{
			Id:    primitives.CreateStringPointer(taskID),
			Title: primitives.CreateStringPointer(titleWithTags),
		}

		mockProjectRepo.On("GetProjectByID", mock.Anything).Return(project)
		mockTaskRepo.On("GetTaskByID", mock.Anything).Return(task, tasks_errors.NoTaskError())

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

		assert.EqualValues(t, "this is  the title", dto.Task.Title)

	})
}

func TestSendTaskAssignationNotification(t *testing.T) {

	projectID := "project-id-123"
	taskID := "task-id-xyz"

	project := project.Project{
		Id:   projectID,
		Name: "my project's name",
	}

	var taskAssignationDTO TaskAssignationEventDTO

	sendTaskAssignationEventFn = func(dto TaskAssignationEventDTO) error {
		taskAssignationDTO = dto
		return nil
	}

	t.Run("it should correctly map the input to the TaskAssignationDTO with the outputs of project and task repos", func(t *testing.T) {

		notificationsAPI, mockProjectRepo, mockTaskRepo := setupServiceWithMocks()

		task := tasks_models.Task{
			Id:    primitives.CreateStringPointer(taskID),
			Title: primitives.CreateStringPointer("title of task"),
		}
		mockProjectRepo.On("GetProjectByID", mock.Anything).Return(project)
		mockTaskRepo.On("GetTaskByID", mock.Anything).Return(task, tasks_errors.NoTaskError())

		input := SendAssignationNotificationInput{
			TaskID:     taskID,
			ProjectID:  projectID,
			AssigneeID: "assignee-id-1234",
		}

		notificationsAPI.SendTaskAssignationNotification(input)

		expectedDTO := TaskAssignationEventDTO{
			Task: NotificationTaskDTO{
				Id:    *task.Id,
				Title: *task.Title,
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

func setupServiceWithMocks() (NotificationsAPI, *project.MockProjectQueriesRepository, *tasks_queries.MockTasksQueriesService) {
	mockProjectRepo := new(project.MockProjectQueriesRepository)
	mockTaskRepo := new(tasks_queries.MockTasksQueriesService)
	notificationsAPI := NewNotificationsAPI(mockProjectRepo, mockTaskRepo)

	return notificationsAPI, mockProjectRepo, mockTaskRepo
}
