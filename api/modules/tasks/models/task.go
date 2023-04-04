package tasks_models

import (
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	task_type "github.com/tim-mhn/figma-clone/modules/task-type"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
)

type Task struct {
	Points                                int
	Assignee                              auth.User
	Id, Title, RawTitle, Description, Key *string
	Status                                TaskStatus
	Type                                  task_type.TaskType
	Tags                                  tags.TaskTags
	Sprint                                sprints.SprintIdName
}

type TaskWithSprint struct {
	Task
	Sprint sprints.SprintInfo
}

type ProjectInfo struct {
	Id, Name string
}
type TaskInfo struct {
	Points                      int
	Id, Title, Description, Key string
	Project                     ProjectInfo
}
