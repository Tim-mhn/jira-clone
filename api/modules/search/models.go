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
