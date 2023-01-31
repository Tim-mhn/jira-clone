package task_comments

import (
	"database/sql"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/lib/pq"
	"github.com/stretchr/testify/assert"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

func TestCreateComment(t *testing.T) {

	t.Run("should return NoCommentError if runQuery doesn't return any error", func(t *testing.T) {
		runInsertCommentQueryFn = func(createComment CreateCommentInput, conn *sql.DB) error {
			return nil
		}

		repo := new(sqlTaskCommentsRepository)

		err := repo.createComment(CreateCommentInput{})
		expectedResponse := NO_COMMENTS_ERROR()
		assert.Equal(t, expectedResponse, err, "Repo should not return error if the query works")

	})

	t.Run("should return TaskNotFound if runQuery returns a task foreign key error", func(t *testing.T) {
		runInsertCommentQueryFn = func(createComment CreateCommentInput, conn *sql.DB) error {
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
		runInsertCommentQueryFn = func(createComment CreateCommentInput, conn *sql.DB) error {
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

type getCommentsQueryResponse struct {
	err      error
	comments TaskComments
}

type getCommentsQueryExpected struct {
	err      CommentsError
	comments TaskComments
}

type getCommentsTestData struct {
	name          string
	queryResponse getCommentsQueryResponse
	expected      getCommentsQueryExpected
}

func MOCK_TASK_FOREIGN_KEY_ERROR() error {
	return &pq.Error{
		Constraint: "comment_task_fk",
	}
}

var (
	comment1 = TaskComment{
		Id:        "id-1",
		Text:      "comment 1",
		Author:    auth.BuildUserWithIcon("user 1", "user", "email@email.com"),
		CreatedOn: time.Now(),
	}

	comment2 = TaskComment{
		Id:        "id-2",
		Text:      "comment 2",
		Author:    auth.BuildUserWithIcon("other user", "other user name", "other-email@email.com"),
		CreatedOn: time.Now(),
	}
)

func TestGetComments(t *testing.T) {

	testsData := []getCommentsTestData{
		{
			name: "should return NO COMMENTS ERROR if query doesn't return any error",
			queryResponse: getCommentsQueryResponse{
				err:      nil,
				comments: []TaskComment{comment1, comment2},
			},
			expected: getCommentsQueryExpected{
				err:      NO_COMMENTS_ERROR(),
				comments: []TaskComment{comment1, comment2},
			},
		},
		{
			name: "should return TaskNotFound if query returns a task foreign key error",
			queryResponse: getCommentsQueryResponse{
				err:      MOCK_TASK_FOREIGN_KEY_ERROR(),
				comments: []TaskComment{comment1, comment2},
			},
			expected: getCommentsQueryExpected{
				err:      buildCommentsError(TaskNotFound, MOCK_TASK_FOREIGN_KEY_ERROR()),
				comments: TaskComments{},
			},
		},
	}

	for _, testData := range testsData {
		t.Run(testData.name, func(t *testing.T) {

			db, mock, dbErr := sqlmock.New()
			if dbErr != nil {
				t.Errorf("an error '%s' was not expected when opening a stub database connection", dbErr)
			}
			defer db.Close()

			repo := newSQLTaskCommentsRepository(db)

			hasError := testData.queryResponse.err != nil
			if hasError {
				mock.ExpectQuery("SELECT task_comment").WillReturnError(testData.queryResponse.err)

			} else {
				rows := buildMockRowsFromTestData(testData.queryResponse.comments)
				mock.ExpectQuery("SELECT task_comment").WillReturnRows(rows)
			}

			comments, err := repo.getTaskComments("ceacaec")

			expectedResults := testData.expected

			assert.EqualValues(t, err, expectedResults.err)

			// if !hasError {

			// assert.EqualValues(t, comment1.Id, comments[0].Id)
			// assert.EqualValues(t, comment2.Id, comments[1].Id)

			assert.EqualValues(t, testData.expected.comments, comments)

			// }

		})
	}

}

func buildMockRowsFromTestData(comments TaskComments) *sqlmock.Rows {
	rows := sqlmock.NewRows([]string{
		"id", "text", "created_on", "author_id", "author_name", "author_email",
	})

	for _, comment := range comments {
		rows = rows.AddRow(
			comment.Id, comment.Text, comment.CreatedOn,
			comment.Author.Id, comment.Author.Name, comment.Author.Email)
	}

	return rows
}
