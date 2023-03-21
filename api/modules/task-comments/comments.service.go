package task_comments

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/tim-mhn/figma-clone/modules/auth"
	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
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
	tasksQueries     tasks_services.ITasksQueriesService
}

func NewTaskCommentsService(repo TaskCommentsRepository, projectQueries project.ProjectQueriesRepository, tasksQueries tasks_services.ITasksQueriesService) TaskCommentsService {
	return TaskCommentsService{
		repo:             repo,
		projectQueries:   projectQueries,
		notificationsAPI: notifications_api.NewNotificationsAPI(),
		tasksQueries:     tasksQueries,
	}
}

func (service TaskCommentsService) postComment(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) CommentsError {
	err := service.repo.createComment(comment)

	if err.HasError {
		return err
	}

	notificationsError := service.createNewCommentNotifications(comment, author, authCookie)

	if notificationsError != nil {
		return buildCommentsError(OtherCommentError, notificationsError)
	}

	return NO_COMMENTS_ERROR()
}

func (s TaskCommentsService) createNewCommentNotifications(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) error {

	if comment.ProjectID == "" {
		return buildCommentsError(OtherCommentError, fmt.Errorf("missing project id to create comment notification"))
	}

	projectChan := make(chan project.Project, 1)
	taskChan := make(chan tasks_models.Task, 1)
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		project, _ := s.projectQueries.GetProjectByID(comment.ProjectID)
		projectChan <- project
		wg.Done()
	}()

	go func() {
		task, _ := s.tasksQueries.GetTaskById(comment.TaskID)
		taskChan <- task
		wg.Done()

	}()

	project := <-projectChan
	task := <-taskChan
	wg.Wait()

	dto := notifications_api.NewCommentNotificationDTO{
		Task: notifications_api.CommentTaskDTO{
			Id:   comment.TaskID,
			Name: *task.Title,
		},
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
