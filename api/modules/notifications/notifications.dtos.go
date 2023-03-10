package notifications_api

type FollowTaskDTO struct {
	UserID string `json:"userId"`
	TaskID string `json:"taskId"`
}

type CommentAuthor struct {
	Name string `json:"name"`
	ID   string `json:"id"`
}

type ProjectIdName struct {
	Name string `json:"name" binding:"required"`
	ID   string `json:"id" binding:"required"`
}
type NewCommentNotificationDTO struct {
	TaskID  string        `json:"taskId" binding:"required"`
	Comment string        `json:"comment" binding:"required"`
	Author  CommentAuthor `json:"author" binding:"required"`
	Project ProjectIdName `json:"project" binding:"required"`
}

type AssignationNotificationDTO struct {
	TaskID     string        `json:"taskId" binding:"required"`
	AssigneeID string        `json:"assigneeId" binding:"required"`
	Project    ProjectIdName `json:"project" binding:"required"`
}
