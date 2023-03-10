package task_comments

import (
	"fmt"
	"net/http"

	"github.com/tim-mhn/figma-clone/modules/auth"
	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
	"github.com/tim-mhn/figma-clone/modules/project"
)

type ITaskCommentsService interface {
	postComment(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) CommentsError
	getTaskComments(taskID string) (TaskComments, CommentsError)
	deleteComment(commentID string) CommentsError
	editCommentText(editComment EditCommentInput) CommentsError
}
type TaskCommentsService struct {
	repo             TaskCommentsRepository
	projectQueries   project.ProjectQueriesRepository
	notificationsAPI notifications_api.NotificationsAPI
}

func NewTaskCommentsService(repo TaskCommentsRepository, projectQueries project.ProjectQueriesRepository) TaskCommentsService {
	return TaskCommentsService{
		repo:             repo,
		projectQueries:   projectQueries,
		notificationsAPI: notifications_api.NewNotificationsAPI(),
	}
}

func (service TaskCommentsService) postComment(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) CommentsError {
	err := service.repo.createComment(comment)

	if err.HasError {
		return err
	}

	notificationsError := service.createNewCommentNotification(comment, author, authCookie)

	if notificationsError != nil {
		return buildCommentsError(OtherCommentError, notificationsError)
	}

	return NO_COMMENTS_ERROR()
}

func (s TaskCommentsService) createNewCommentNotification(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) error {

	if comment.ProjectID == "" {
		return buildCommentsError(OtherCommentError, fmt.Errorf("missing project id to create comment notification"))
	}

	project, _ := s.projectQueries.GetProjectByID(comment.ProjectID)

	dto := notifications_api.NewCommentNotificationDTO{
		TaskID:  comment.TaskID,
		Comment: comment.Text,
		Author: notifications_api.CommentAuthor{
			Name: author.Name,
			ID:   author.Id,
		},
		Project: notifications_api.ProjectIdName{
			Name: project.Name,
			ID:   project.Id,
		},
	}

	return s.notificationsAPI.CreateCommentNotification(dto, authCookie)
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
