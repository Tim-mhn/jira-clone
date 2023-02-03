package task_comments

type CreateCommentInput struct {
	Text, AuthorID, TaskID string
}

type EditCommentInput struct {
	Text, CommentID string
}
