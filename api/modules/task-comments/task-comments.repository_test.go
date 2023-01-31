package task_comments

import (
	"database/sql"
	"testing"

	"github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestCreateComment(t *testing.T) {

	t.Run("should return NoCommentError if runQuery doesn't return any error", func(t *testing.T) {
		runQueryFn = func(createComment CreateCommentInput, conn *sql.DB) error {
			return nil
		}

		repo := new(sqlTaskCommentsRepository)

		err := repo.createComment(CreateCommentInput{})
		expectedResponse := NO_COMMENTS_ERROR()
		assert.Equal(t, expectedResponse, err, "Repo should not return error if the query works")

	})

	t.Run("should return TaskNotFound if runQuery returns a task foreign key error", func(t *testing.T) {
		runQueryFn = func(createComment CreateCommentInput, conn *sql.DB) error {
			return &pq.Error{
				Constraint: "comment_task_fk",
			}
		}

		repo := new(sqlTaskCommentsRepository)

		err := repo.createComment(CreateCommentInput{})
		expectedResponseCode := TaskNotFound
		assert.EqualValues(t, expectedResponseCode, err.Code, "should return TaskNotFound if runQuery returns a task foreign key error")

	})

	t.Run("should return AuthorNotFound if runQuery returns a author foreign key error", func(t *testing.T) {
		runQueryFn = func(createComment CreateCommentInput, conn *sql.DB) error {
			return &pq.Error{
				Constraint: "comment_author_fk",
			}
		}

		repo := new(sqlTaskCommentsRepository)

		err := repo.createComment(CreateCommentInput{})
		expectedResponseCode := AuthorNotFound
		assert.EqualValues(t, expectedResponseCode, err.Code, "should return AuthorNotFound if runQuery returns a author foreign key error")

	})
}
