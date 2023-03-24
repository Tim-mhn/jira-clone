package notifications_api

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"

	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

type NotificationsAPI interface {
	FollowTask(dto FollowTaskDTO, authCookie *http.Cookie) error
	CreateCommentNotification(input CreateCommentNotificationInput, authCookie *http.Cookie) error
	SendTaskAssignationNotification(input SendAssignationNotificationInput, authCookie *http.Cookie) error
}

func NewNotificationsAPI(projectRepo project.ProjectQueriesRepository,
	taskQueries tasks_repositories.TaskQueriesRepository) NotificationsAPI {
	return NotificationsAPIImpl{
		projectRepo: projectRepo,
		taskQueries: taskQueries,
	}
}

type NotificationsAPIImpl struct {
	projectRepo project.ProjectQueriesRepository
	taskQueries tasks_repositories.TaskQueriesRepository
}

func (s NotificationsAPIImpl) FollowTask(dto FollowTaskDTO, authCookie *http.Cookie) error {

	req := http_utils.BuildRequest(http_utils.POST, _FOLLOW_TASK_URL(), dto)
	req.AddCookie(authCookie)

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("error in follow task. Returned status: %d", resp.StatusCode)
	}

	return nil
}

var (
	buildRequestFn                       = http_utils.BuildRequest
	httpClient     http_utils.HTTPClient = http.DefaultClient
)

func (s NotificationsAPIImpl) CreateCommentNotification(input CreateCommentNotificationInput, authCookie *http.Cookie) error {
	dto := s.mapCommentInputToDTO(input)
	req := buildRequestFn(http_utils.POST, _COMMENT_TASK_URL(), dto)
	req.AddCookie(authCookie)

	resp, err := httpClient.Do(req)

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil

}

func (s NotificationsAPIImpl) SendTaskAssignationNotification(input SendAssignationNotificationInput, authCookie *http.Cookie) error {
	dto := s.mapAssignationInputToDTO(input)

	req := buildRequestFn(http_utils.POST, _ASSIGNATION_URL(), dto)
	req.AddCookie(authCookie)

	resp, err := httpClient.Do(req)

	if err != nil {
		return err
	}

	_, err = ioutil.ReadAll(resp.Body) // response body is []byte

	return err

}

func (s NotificationsAPIImpl) mapAssignationInputToDTO(input SendAssignationNotificationInput) AssignationNotificationDTO {
	project, task := s.getProjectAndTaskFromIds(input.ProjectID, input.TaskID)

	dto := AssignationNotificationDTO{
		Task: NotificationTaskDTO{
			Id:    input.TaskID,
			Title: tags.RemoveTagsFromTaskTitle(*task.Title),
		},
		Project: ProjectIdName{
			Name: project.Name,
			ID:   project.Id,
		},
		AssigneeID: input.AssigneeID,
	}

	return dto

}

func (s NotificationsAPIImpl) mapCommentInputToDTO(input CreateCommentNotificationInput) NewCommentNotificationDTO {
	project, task := s.getProjectAndTaskFromIds(input.ProjectID, input.TaskID)

	dto := NewCommentNotificationDTO{
		Task: NotificationTaskDTO{
			Id:    input.TaskID,
			Title: tags.RemoveTagsFromTaskTitle(*task.Title),
		},
		Comment: input.Comment,
		Author:  input.Author,
		Project: ProjectIdName{
			Name: project.Name,
			ID:   project.Id,
		},
	}

	return dto

}

func (s NotificationsAPIImpl) getProjectAndTaskFromIds(projectID string, taskID string) (project.Project, tasks_models.Task) {
	projectChan := make(chan project.Project, 1)
	taskChan := make(chan tasks_models.Task, 1)
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		project, _ := s.projectRepo.GetProjectByID(projectID)
		projectChan <- project
		wg.Done()
	}()

	go func() {
		taskWithSprint, _ := s.taskQueries.GetTaskByID(taskID)
		taskChan <- taskWithSprint.Task
		wg.Done()

	}()

	project := <-projectChan
	task := <-taskChan
	wg.Wait()

	return project, task
}
