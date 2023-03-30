package task_comments

import (
	"fmt"
	"net/http"

	"github.com/tim-mhn/figma-clone/modules/auth"
	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
)

type ITaskCommentsService interface {
	postComment(comment CreateCommentInput, author auth.User, authCookie *http.Cookie) CommentsError
	getTaskComments(taskID string) (TaskComments, CommentsError)
	deleteComment(commentID string) CommentsError
	editCommentText(editComment EditCommentInput) CommentsError
}
type TaskCommentsService struct {
	repo             TaskCommentsRepository
	notificationsAPI notifications_api.NotificationsAPI
}

func NewTaskCommentsService(repo TaskCommentsRepository, projectQueries project.ProjectQueriesRepository, taskQueriesRepo tasks_repositories.TaskQueriesRepository) TaskCommentsService {
	return TaskCommentsService{
		repo:             repo,
		notificationsAPI: notifications_api.NewNotificationsAPI(projectQueries, taskQueriesRepo),
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

	// projectChan := make(chan project.Project, 1)
	// taskChan := make(chan tasks_models.Task, 1)
	// var wg sync.WaitGroup
	// wg.Add(2)

	// go func() {
	// 	project, _ := s.projectQueries.GetProjectByID(comment.ProjectID)
	// 	projectChan <- project
	// 	wg.Done()
	// }()

	// go func() {
	// 	task, _ := s.tasksQueries.GetTaskByID(comment.TaskID)
	// 	taskChan <- task
	// 	wg.Done()

	// }()

	// project := <-projectChan
	// task := <-taskChan
	// wg.Wait()

	// dto := notifications_api.NewCommentEventDTO{
	// 	Task: notifications_api.NotificationTaskDTO{
	// 		Id:   comment.TaskID,
	// 		Name: tags.RemoveTagsFromTaskTitle(*task.Title), // todo: unify logic to get the tag-less title (for assignation and comment)
	// 	},
	// 	Comment: comment.Text,
	// 	Author: notifications_api.CommentAuthor{
	// 		Name: author.Name,
	// 		ID:   author.Id,
	// 	},
	// 	Project: notifications_api.ProjectIdName{
	// 		Name: project.Name,
	// 		ID:   project.Id,
	// 	},
	// }

	commentNotificationInput := notifications_api.CreateCommentNotificationInput{
		TaskID:  comment.TaskID,
		Comment: comment.Text,
		Author: notifications_api.CommentAuthor{
			Name: author.Name,
			ID:   author.Id,
		},
		ProjectID: comment.ProjectID,
	}

	return s.notificationsAPI.CreateCommentNotification(commentNotificationInput, authCookie)
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
