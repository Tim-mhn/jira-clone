package board

import (
	"github.com/tim-mhn/figma-clone/modules/sprints"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SprintWithTasks struct {
	Tasks  []tasks_models.TaskWithSprint
	Sprint sprints.Sprint
}

type BoardSprints = []SprintWithTasks
