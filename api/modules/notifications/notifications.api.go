package notifications_api

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_queries "github.com/tim-mhn/figma-clone/modules/tasks/queries"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

type NotificationsAPI interface {
	FollowTask(dto FollowTaskDTO, authCookie *http.Cookie) error
	CreateCommentNotification(input CreateCommentNotificationInput, authCookie *http.Cookie) error
	SendTaskAssignationNotification(input SendAssignationNotificationInput) error
}

func NewNotificationsAPI(projectRepo project.ProjectRepository,
	taskQueries tasks_queries.ITasksQueriesService) NotificationsAPI {
	return NotificationsAPIImpl{
		projectRepo: projectRepo,
		taskQueries: taskQueries,
	}
}

type NotificationsAPIImpl struct {
	projectRepo project.ProjectRepository
	taskQueries tasks_queries.ITasksQueriesService
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
	sendTaskAssignationEventFn func(dto TaskAssignationEventDTO) error = sendTaskAssignationEvent
	sendNewCommentEventFn      func(dto NewCommentEventDTO) error      = sendNewCommentEvent
)

func sendTaskAssignationEvent(dto TaskAssignationEventDTO) error {
	exchangeName := "task-assigned"

	channel, err := openPubSubChannel(exchangeName)

	if err != nil {
		return err
	}

	defer channel.Close()

	return publishJSONDataOverChannel(channel, exchangeName, dto)

}

func sendNewCommentEvent(dto NewCommentEventDTO) error {
	exchangeName := "new-comment"
	channel, err := openPubSubChannel(exchangeName)
	if err != nil {
		return err
	}

	defer channel.Close()

	return publishJSONDataOverChannel(channel, exchangeName, dto)
}

func (s NotificationsAPIImpl) CreateCommentNotification(input CreateCommentNotificationInput, authCookie *http.Cookie) error {
	dto := s.mapCommentInputToDTO(input)
	return sendNewCommentEventFn(dto)

}

func (s NotificationsAPIImpl) SendTaskAssignationNotification(input SendAssignationNotificationInput) error {
	dto := s.mapAssignationInputToDTO(input)
	return sendTaskAssignationEventFn(dto)

}

func (s NotificationsAPIImpl) mapAssignationInputToDTO(input SendAssignationNotificationInput) TaskAssignationEventDTO {
	project, task := s.getProjectAndTaskFromIds(input.ProjectID, input.TaskID)

	dto := TaskAssignationEventDTO{
		Task: NotificationTaskDTO{
			Id:    input.TaskID,
			Title: tags.RemoveTagsFromTaskTitle(*task.Title),
		},
		Project: ProjectIdName{
			Name: project.Name,
			ID:   project.Id,
		},
		AssigneeID:   input.AssigneeID,
		AssignedByID: input.AssignedByID,
	}

	return dto

}

func (s NotificationsAPIImpl) mapCommentInputToDTO(input CreateCommentNotificationInput) NewCommentEventDTO {
	project, task := s.getProjectAndTaskFromIds(input.ProjectID, input.TaskID)

	dto := NewCommentEventDTO{
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
		task, _ := s.taskQueries.GetTaskByID(taskID)
		taskChan <- task
		wg.Done()

	}()

	project := <-projectChan
	task := <-taskChan
	wg.Wait()

	return project, task
}
