package tasks_dtos

type NewTaskDTO struct {
	Points      int    `json:"points,omitempty"`
	Title       string `json:"title"`
	AssigneeId  string `json:"assigneeId"`
	Description string `json:"description,omitempty"`
	SprintId    string `json:"sprintId"`
}
