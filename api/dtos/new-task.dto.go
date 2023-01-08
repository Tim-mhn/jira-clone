package dtos

type NewTaskDTO struct {
	Points      int    `json:"points"`
	Title       string `json:"title"`
	AssigneeId  string `json:"assigneeId"`
	Description string `json:"description"`
	SprintID    string `json:sprintId`
}
