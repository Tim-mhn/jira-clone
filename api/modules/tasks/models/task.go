package tasks_models

import (
	"github.com/tim-mhn/figma-clone/modules/auth"
	task_type "github.com/tim-mhn/figma-clone/modules/task-type"
)

type Task struct {
	Points                      int
	Assignee                    auth.User
	Id, Title, Description, Key *string
	Status                      TaskStatus
	Type                        task_type.TaskType
}

type TaskWithSprint struct {
	Task
	Sprint SprintInfo
}
