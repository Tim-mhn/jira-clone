package tasks_services

import (
	"net/http"

	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"

	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
)

type CreateTaskInput struct {
	ProjectID, SprintID, Title, Description, AssigneeID string
}

type TaskCommandsService struct {
	repo             tasks_repositories.TaskCommandsRepository
	tagsService      tags.ITagsService
	notificationsAPI notifications_api.NotificationsAPI
}

func NewTaskCommandsService(repo tasks_repositories.TaskCommandsRepository, tagsService tags.ITagsService, notificationsAPI notifications_api.NotificationsAPI,
) *TaskCommandsService {
	return &TaskCommandsService{
		repo:             repo,
		tagsService:      tagsService,
		notificationsAPI: notificationsAPI,
	}
}

const NEW_TASK_INITIAL_POINTS = 1

func (service TaskCommandsService) CreateTask(input CreateTaskInput) (tasks_models.Task, tasks_errors.TaskError) {

	newTask, err := service.repo.CreateTask(input.ProjectID, input.SprintID, input.Title, input.AssigneeID, NEW_TASK_INITIAL_POINTS, input.Description)

	if err == nil {
		err = service.tagsService.ExtractAndUpdateTagsOfTask(*newTask.Id, *newTask.Title)
	}

	taskError := tasks_errors.NoTaskError()

	if err != nil {
		taskError = tasks_errors.BuildTaskError(tasks_errors.OtherTaskError, err)
	}

	return newTask, taskError

}

func (service TaskCommandsService) UpdateTask(updateTask UpdateTaskInput) tasks_errors.TaskError {
	err := service.repo.UpdateTaskData(updateTask.TaskID, updateTask.NewData)

	if err == nil {
		err = service.updateTaskTagsIfTitleChanged(updateTask.TaskID, updateTask.NewData)
	}

	service.sendNewAssigneeNotificationIfChanged(updateTask)

	if err != nil {
		return tasks_errors.BuildTaskError(tasks_errors.OtherTaskError, err)
	}

	return tasks_errors.NoTaskError()
}

func (service TaskCommandsService) updateTaskTagsIfTitleChanged(taskID string, patchDTO tasks_dtos.PatchTaskDTO) error {
	hasNewTitle := patchDTO.Title != nil
	if hasNewTitle {
		return service.tagsService.ExtractAndUpdateTagsOfTask(taskID, *patchDTO.Title)
	}

	return nil
}

func (service TaskCommandsService) sendNewAssigneeNotificationIfChanged(updateTask UpdateTaskInput) {
	if updateTask.NewData.AssigneeId != nil {

		input := notifications_api.SendAssignationNotificationInput{
			TaskID:     updateTask.TaskID,
			AssigneeID: *updateTask.NewData.AssigneeId,
			ProjectID:  updateTask.ProjectID,
		}
		service.notificationsAPI.SendTaskAssignationNotification(input, updateTask.AuthCookie)
	}
}

func (service TaskCommandsService) DeleteTask(taskID string) (tasks_repositories.DeleteTaskResponse, error) {

	return service.repo.DeleteTask(taskID)
}

type UpdateTaskInput struct {
	TaskID         string
	NewData        tasks_dtos.PatchTaskDTO
	UpdatingUserID string
	ProjectID      string
	AuthCookie     *http.Cookie
}
