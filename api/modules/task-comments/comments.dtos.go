package task_comments

type CreateCommentDTO struct {
	Text string `json:"text" binding:"required"`
}
