package tasks_services

import (
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
)

type CreateTaskInput struct {
	projectID, sprintID, title, description, assigneeID string
	points                                              int
}
type CreateTaskService struct {
	repo *tasks_repositories.TaskCommandsRepository
}

func NewCreateTaskService(repo *tasks_repositories.TaskCommandsRepository) *CreateTaskService {
	return &CreateTaskService{
		repo: repo,
	}
}

func (service *CreateTaskService) CreateTaskAndUploadToSearch(input CreateTaskInput) (tasks_models.Task, error) {
	return service.repo.CreateTask(input.projectID, input.sprintID, input.title, input.assigneeID, input.points, input.description)
}
