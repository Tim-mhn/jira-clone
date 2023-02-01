package tasks_dtos

import (
	"time"

	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SprintWithTasks struct {
	Tasks  []tasks_models.TaskWithSprint
	Sprint tasks_models.Sprint
}

func (sprintWithTasksDTO SprintWithTasks) IsBacklog() bool {
	return sprintWithTasksDTO.Sprint.IsBacklog
}

func (sprintWithTasksDTO SprintWithTasks) CreatedOn() time.Time {
	return sprintWithTasksDTO.Sprint.CreationTime
}

type SprintListWithTasksDTO = []SprintWithTasks
