package project

import (
	"github.com/tim-mhn/figma-clone/modules/auth"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type Project struct {
	Id   string
	Name string
	Key  string
	Icon string
}

type ProjectWithMembers struct {
	Id      string
	Name    string
	Key     string
	Members []auth.User
}

type ProjectWithMembersAndTasks struct {
	Id      string
	Name    string
	Members []auth.User
	Tasks   []tasks_models.Task
}
