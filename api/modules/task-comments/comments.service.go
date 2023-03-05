package task_comments

import (
	"net/http"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/notifications"
)

type ITaskCommentsService interface {
	postComment(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) CommentsError
	getTaskComments(taskID string) (TaskComments, CommentsError)
	deleteComment(commentID string) CommentsError
	editCommentText(editComment EditCommentInput) CommentsError
}
type TaskCommentsService struct {
	repo TaskCommentsRepository
}

func NewTaskCommentsService(repo TaskCommentsRepository) TaskCommentsService {
	return TaskCommentsService{
		repo: repo,
	}
}

func (service TaskCommentsService) postComment(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) CommentsError {
	err := service.repo.createComment(comment)

	if err.HasError {
		return err
	}

	dto := notifications.NewCommentNotificationDTO{
		TaskID:  comment.TaskID,
		Comment: comment.Text,
		Author: notifications.CommentAuthor{
			Name: author.Name,
			ID:   author.Id,
		},
	}

	notificationsError := notifications.CreateCommentNotification(dto, authCookie)

	if notificationsError != nil {
		return buildCommentsError(OtherCommentError, notificationsError)
	}

	return NO_COMMENTS_ERROR()
}

func (s TaskCommentsService) getTaskComments(taskID string) (TaskComments, CommentsError) {
	return s.repo.getTaskComments(taskID)
}
func (s TaskCommentsService) deleteComment(commentID string) CommentsError {
	return s.repo.deleteComment(commentID)
}
func (s TaskCommentsService) editCommentText(editComment EditCommentInput) CommentsError {
	return s.repo.editCommentText(editComment)
}
