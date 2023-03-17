package task_comments

type CreateCommentInput struct {
	Text, AuthorID, TaskID, ProjectID string
}

type EditCommentInput struct {
	Text, CommentID string
}
