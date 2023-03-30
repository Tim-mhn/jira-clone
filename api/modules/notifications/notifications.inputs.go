package notifications_api

type CreateCommentNotificationInput struct {
	TaskID    string
	Comment   string
	Author    CommentAuthor
	ProjectID string
}

type SendAssignationNotificationInput struct {
	TaskID       string
	AssigneeID   string
	ProjectID    string
	AssignedByID string
}
