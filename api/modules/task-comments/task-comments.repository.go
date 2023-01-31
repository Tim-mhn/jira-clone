package task_comments

import (
	"database/sql"

	"github.com/lib/pq"
	"github.com/tim-mhn/figma-clone/database"
)

type TaskCommentsRepository interface {
	createComment(createComment CreateCommentInput) CommentsError
}

type sqlTaskCommentsRepository struct {
	conn *sql.DB
}

func newSQLTaskCommentsRepository(conn *sql.DB) TaskCommentsRepository {
	return sqlTaskCommentsRepository{
		conn: conn,
	}
}

func (repo sqlTaskCommentsRepository) createComment(createComment CreateCommentInput) CommentsError {

	err := runQueryFn(createComment, repo.conn)

	if err != nil {
		return buildCommentsErrorFromDbError(err)
	}

	return NO_COMMENTS_ERROR()
}

var (
	runQueryFn = runDBQuery
)

func runDBQuery(createComment CreateCommentInput, conn *sql.DB) error {
	builder := database.GetPsqlQueryBuilder().
		Insert("task_comment").
		Columns("task_id", "text", "author_id").
		Values(createComment.TaskID, createComment.Text, createComment.AuthorID)

	_, err := builder.RunWith(conn).Exec()
	return err
}

func buildCommentsErrorFromDbError(err error) CommentsError {

	dbError := err.(*pq.Error)

	var errorCode CommentsErrorCode
	switch dbError.Constraint {

	case "comment_task_fk":
		errorCode = TaskNotFound

	case "comment_author_fk":
		errorCode = AuthorNotFound

	default:
		errorCode = OtherCommentError
	}

	return buildCommentsError(errorCode, err)
}
