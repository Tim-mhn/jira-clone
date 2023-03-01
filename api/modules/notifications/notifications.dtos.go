package notifications

type FollowTaskDTO struct {
	UserID string `json:"userId"`
	TaskID string `json:"taskId"`
}

type CommentAuthor struct {
	Name string `json:"name"`
	ID   string `json:"id"`
}
type NewCommentNotificationDTO struct {
	TaskID  string        `json:"taskId"`
	Comment string        `json:"comment"`
	Author  CommentAuthor `json:"author"`
}
