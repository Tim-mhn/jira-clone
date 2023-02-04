package tasks_dtos

import (
	"time"

	"github.com/tim-mhn/figma-clone/modules/sprints"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SprintWithTasks struct {
	Tasks  []tasks_models.TaskWithSprint
	Sprint sprints.Sprint
}

func (sprintWithTasksDTO SprintWithTasks) IsBacklog() bool {
	return sprintWithTasksDTO.Sprint.IsBacklog
}

func (sprintWithTasksDTO SprintWithTasks) CreatedOn() time.Time {
	return sprintWithTasksDTO.Sprint.CreationTime
}

type SprintListWithTasksDTO = []SprintWithTasks
