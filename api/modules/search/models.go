package search

type ProjectInfo struct {
	Id, Name string
}
type TaskInfo struct {
	Points                      int
	Id, Title, Description, Key string
	Project                     ProjectInfo
}

type UserID string

type SearchText string

type SearchInput struct {
	UserID string
	Text   string
}

type SprintInfo struct {
	Id, Name string
	Project  ProjectInfo
}

type SearchResultType string

const (
	TaskResult   SearchResultType = "task"
	SprintResult SearchResultType = "sprint"
)

type SearchResults struct {
	Tasks   []TaskInfo
	Sprints []SprintInfo
}
