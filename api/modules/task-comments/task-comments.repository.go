package task_comments

import (
	"database/sql"

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

	builder := database.GetPsqlQueryBuilder().
		Insert("task_comment").
		Columns("task_id", "text", "author_id").
		Values(createComment.TaskID, createComment.Text, createComment.AuthorID)

	_, err := builder.RunWith(repo.conn).Exec()

	if err != nil {
		return buildCommentsError(OtherCommentError, err)

	}

	return NO_COMMENTS_ERROR()
}
