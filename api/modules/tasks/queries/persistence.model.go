package tasks_queries

import (
	task_type "github.com/tim-mhn/figma-clone/modules/task-type"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type TaskPersistenceModel struct {
	id, rawTitle, description, project_key, sprint_id, sprint_name string
	status                                                         tasks_models.TaskStatus
	Type                                                           task_type.TaskType
	assignee_id, assignee_name, assignee_email                     string
	points, task_number                                            int
}

type TaskInfoPersistenceModel struct {
	Id, Raw_title, Description, Project_key, Project_id, Project_name string
	Points, Task_number                                               int
}
