package tasks_queries

import (
	"fmt"

	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type ITasksQueriesService interface {
	GetTaskByID(taskID string) (tasks_models.Task, tasks_errors.TaskError)
	GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.Task, error)
}

type TasksQueriesService struct {
	taskRepo TaskQueriesRepository
}

func NewTasksQueriesService(taskRepo TaskQueriesRepository) ITasksQueriesService {
	return &TasksQueriesService{
		taskRepo: taskRepo,
	}
}

func (service *TasksQueriesService) GetTaskByID(taskID string) (tasks_models.Task, tasks_errors.TaskError) {

	taskPersistence, err := service.taskRepo.GetTaskByID(taskID)

	if err.HasError {
		return tasks_models.Task{}, err
	}

	task := buildTaskFromPersistenceData(taskPersistence)
	return task, tasks_errors.NoTaskError()

}

func (service *TasksQueriesService) GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.Task, error) {
	dbTasks, err := service.taskRepo.GetSprintTasks(sprintID, filters)

	if err != nil {
		return []tasks_models.Task{}, err
	}

	var tasks []tasks_models.Task

	for _, taskPersistence := range dbTasks {
		task := buildTaskFromPersistenceData(taskPersistence)
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func buildTaskKey(projectKey string, taskNumber int) string {
	return fmt.Sprintf("%s-%d", projectKey, taskNumber)
}
