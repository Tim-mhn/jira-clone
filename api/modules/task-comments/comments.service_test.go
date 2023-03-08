package task_comments

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
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
