package search

import tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"

type UserID string

type SearchText string

type SearchInput struct {
	UserID string
	Text   string
}

type SprintInfo struct {
	Id, Name string
	Project  tasks_models.ProjectInfo
}

type SearchResultType string

const (
	TaskResult   SearchResultType = "task"
	SprintResult SearchResultType = "sprint"
)

type SearchResults struct {
	Tasks   []tasks_models.TaskInfo
	Sprints []SprintInfo
}
