package task_comments

import (
	"database/sql"

	"github.com/Masterminds/squirrel"
	"github.com/lib/pq"
	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type TaskCommentsRepository interface {
	createComment(createComment CreateCommentInput) CommentsError
	getTaskComments(taskID string) (TaskComments, CommentsError)
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

	err := runInsertCommentQueryFn(createComment, repo.conn)

	if err != nil {
		return buildCommentsErrorFromDbError(err)
	}

	return NO_COMMENTS_ERROR()
}

func (repo sqlTaskCommentsRepository) getTaskComments(taskID string) (TaskComments, CommentsError) {
	rows, err := runGetCommentsSQLQueryFn(taskID, repo.conn)

	if err != nil {
		commentsError := buildCommentsErrorFromDbError(err)
		return TaskComments{}, commentsError
	}

	comments, dbError := buildCommentsFromRows(rows)

	if dbError != nil {
		return comments, buildCommentsError(OtherCommentError, dbError)
	}
	return comments, NO_COMMENTS_ERROR()
}

func buildCommentsFromRows(rows *sql.Rows) (TaskComments, error) {
	comments := []TaskComment{}

	for rows.Next() {
		var comment TaskComment
		var tmpAuthor auth.User
		err := rows.Scan(&comment.Id, &comment.Text, &comment.CreatedOn,
			&tmpAuthor.Id, &tmpAuthor.Name, &tmpAuthor.Email)

		comment.Author = auth.BuildUserWithIcon(tmpAuthor.Id, tmpAuthor.Name, tmpAuthor.Email)

		if err != nil {
			return []TaskComment{}, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

var (
	runInsertCommentQueryFn  = runInsertCommentSQLQuery
	runGetCommentsSQLQueryFn = runGetCommentsSQLQuery
)

func runInsertCommentSQLQuery(createComment CreateCommentInput, conn *sql.DB) error {
	builder := database.GetPsqlQueryBuilder().
		Insert("task_comment").
		Columns("task_id", "text", "author_id").
		Values(createComment.TaskID, createComment.Text, createComment.AuthorID)

	_, err := builder.RunWith(conn).Exec()
	return err
}

func runGetCommentsSQLQuery(taskId string, conn *sql.DB) (*sql.Rows, error) {
	builder := database.GetPsqlQueryBuilder().
		Select("task_comment.id as comment_id", "text", "created_on", "author_id", `"user".name`, `"user".email`).
		From("task_comment").
		LeftJoin(`"user" ON author_id="user".id`).
		Where(squirrel.Eq{
			"task_id": taskId,
		}).
		OrderBy("created_on DESC")

	return builder.RunWith(conn).Query()
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
