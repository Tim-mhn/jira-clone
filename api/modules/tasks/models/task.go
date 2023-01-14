package tasks_models

import (
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type Task struct {
	Points                      int
	Assignee                    auth.User
	Id, Title, Description, Key *string
	Status                      TaskStatus
}
