package tasks_models

import (
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	task_type "github.com/tim-mhn/figma-clone/modules/task-type"
)

type Task struct {
	Points                                int
	Assignee                              auth.User
	Id, Title, RawTitle, Description, Key *string
	Status                                TaskStatus
	Type                                  task_type.TaskType
}

type TaskWithSprint struct {
	Task
	Sprint sprints.SprintInfo
}
