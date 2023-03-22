package task_comments

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
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

	mockNotifsAPI := new(notifications_api.MockNotificationsAPI)
	service := new(TaskCommentsService)
	service.notificationsAPI = mockNotifsAPI
	service.repo = mockCommentsRepo
	t.Run("it should build the correct dto from the task/project queries results", func(t *testing.T) {

		author := auth.User{
			Id:    "author-id",
			Name:  "author-name",
			Email: "author@mail.com",
		}

		taskID := "task-id-xyz"
		projectID := "project-id-123-xyz"

		mockNotifsAPI.On("CreateCommentNotification", mock.Anything, mock.Anything).Return(nil)

		commentInput := CreateCommentInput{
			Text:      "comment",
			AuthorID:  author.Id,
			TaskID:    taskID,
			ProjectID: projectID,
		}

		expectedNotifsAPIInput := notifications_api.CreateCommentNotificationInput{
			TaskID:  taskID,
			Comment: commentInput.Text,
			Author: notifications_api.CommentAuthor{
				Name: author.Name,
				ID:   author.Id,
			},
			ProjectID: projectID,
		}
		service.createNewCommentNotifications(commentInput, author, &http.Cookie{})

		mockNotifsAPI.AssertCalled(t, "CreateCommentNotification", expectedNotifsAPIInput, mock.Anything)
	})
}
