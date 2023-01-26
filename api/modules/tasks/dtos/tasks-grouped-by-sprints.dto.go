package tasks_dtos

import (
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SprintWithTasks struct {
	Tasks  []tasks_models.Task
	Sprint tasks_models.Sprint
}

func (sprintWithTasksDTO SprintWithTasks) IsBacklog() bool {
	return sprintWithTasksDTO.Sprint.IsBacklog
}

type SprintListWithTasksDTO = []SprintWithTasks
