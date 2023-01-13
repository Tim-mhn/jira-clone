package tasks_dtos

import (
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SprintWithTasks struct {
	Tasks  []tasks_models.Task
	Sprint tasks_models.Sprint
}

type SprintListWithTasksDTO = []SprintWithTasks
