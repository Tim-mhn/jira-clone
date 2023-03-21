package task_comments

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
)

type MockCommentsRepository struct {
	mock.Mock
}

func (repo *MockCommentsRepository) createComment(createComment CreateCommentInput) CommentsError {

	return NO_COMMENTS_ERROR()
}

func (repo *MockCommentsRepository) deleteComment(commentID string) CommentsError {
	return NO_COMMENTS_ERROR()
}
func (repo *MockCommentsRepository) getTaskComments(taskID string) (TaskComments, CommentsError) {
	return []TaskComment{}, NO_COMMENTS_ERROR()
}
func (repo *MockCommentsRepository) editCommentText(editComment EditCommentInput) CommentsError {
	return NO_COMMENTS_ERROR()
}

type MockNotificationsAPI struct {
	mock.Mock
}

func (mock *MockNotificationsAPI) FollowTask(dto notifications_api.FollowTaskDTO, authCookie *http.Cookie) error {
	return nil
}
func (mock *MockNotificationsAPI) CreateCommentNotification(dto notifications_api.NewCommentNotificationDTO, authCookie *http.Cookie) error {
	args := mock.Called(dto, authCookie)
	errorOrNil := args.Get(0)
	if errorOrNil != nil {
		return errorOrNil.(error)
	}
	return nil
}
func (mock *MockNotificationsAPI) SendTaskAssignationNotification(dto notifications_api.AssignationNotificationDTO, authCookie *http.Cookie) error {
	return nil
}

func TestPostComment(t *testing.T) {

	t.Run("it should throw an error if comment.ProjectID is an empty empty", func(t *testing.T) {

		mockCommentsRepo := new(MockCommentsRepository)

		service := new(TaskCommentsService)
		service.repo = mockCommentsRepo

		author := auth.User{
			Id:    "author-id",
			Name:  "author-name",
			Email: "email@gmail.com",
		}
		comment := CreateCommentInput{
			Text:      "text",
			AuthorID:  author.Id,
			TaskID:    "task-id",
			ProjectID: "",
		}

		err := service.postComment(comment, author, &http.Cookie{})

		assert.EqualValues(t, OtherCommentError, err.Code)

	})
}

func TestCreateNewCommentNotifications(t *testing.T) {

	mockCommentsRepo := new(MockCommentsRepository)

	mockProjectRepo := project.NewMockProjectQueriesRepository()
	mockNotifsAPI := new(MockNotificationsAPI)
	mockTaskQueries := new(tasks_services.MockTasksQueriesService)
	service := new(TaskCommentsService)
	service.notificationsAPI = mockNotifsAPI
	service.repo = mockCommentsRepo
	service.projectQueries = mockProjectRepo
	service.tasksQueries = mockTaskQueries
	t.Run("it should build the correct dto from the task/project queries results", func(t *testing.T) {

		author := auth.User{
			Id:    "author-id",
			Name:  "author-name",
			Email: "author@mail.com",
		}

		taskID := "task-id-xyz"
		taskName := "Task Name "

		mockProject := notifications_api.ProjectIdName{
			Name: "project name",
			ID:   "project-id-123-npx",
		}

		task := tasks_models.Task{
			Id:    &taskID,
			Title: &taskName,
		}
		mockTaskQueries.On("GetTaskByID", taskID).Return(task)
		mockProjectRepo.On("GetProjectByID", mockProject.ID).Return(project.Project{
			Id:   mockProject.ID,
			Name: mockProject.Name,
		})

		mockNotifsAPI.On("CreateCommentNotification", mock.Anything, mock.Anything).Return(nil)

		commentInput := CreateCommentInput{
			Text:      "comment",
			AuthorID:  author.Id,
			TaskID:    taskID,
			ProjectID: mockProject.ID,
		}

		expectedNotifsAPIInput := notifications_api.NewCommentNotificationDTO{
			Task: notifications_api.NotificationTaskDTO{
				Id:   taskID,
				Name: taskName,
			},
			Comment: commentInput.Text,
			Author: notifications_api.CommentAuthor{
				Name: author.Name,
				ID:   author.Id,
			},
			Project: mockProject,
		}
		service.createNewCommentNotifications(commentInput, author, &http.Cookie{})

		mockNotifsAPI.AssertCalled(t, "CreateCommentNotification", expectedNotifsAPIInput, mock.Anything)
	})
}
