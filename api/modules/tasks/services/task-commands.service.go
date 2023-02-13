package tasks_services

import (
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"

	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
)

type CreateTaskInput struct {
	ProjectID, SprintID, Title, Description, AssigneeID string
}

type UpdateTaskInput struct {
	Status      *int
	AssigneeId  *string
	Description *string
	Title       *string
	Points      *int
	SprintId    *string
	Type        *int
}

type TaskCommandsService struct {
	repo        tasks_repositories.TaskCommandsRepository
	tagsService tags.ITagsService
}

func NewTaskCommandsService(repo tasks_repositories.TaskCommandsRepository, tagsService tags.ITagsService) *TaskCommandsService {
	return &TaskCommandsService{
		repo:        repo,
		tagsService: tagsService,
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

func (service TaskCommandsService) UpdateTaskAndTags(taskID string, patchDTO tasks_dtos.PatchTaskDTO) tasks_errors.TaskError {
	err := service.repo.UpdateTask(taskID, patchDTO)

	if err == nil {
		err = service.updateTaskTagsIfTitleChanged(taskID, patchDTO)
	}

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