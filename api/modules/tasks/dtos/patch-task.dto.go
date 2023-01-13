package tasks_dtos

type PatchTaskDTO struct {
	Status      *int    `json:"status,omitempty"`
	AssigneeId  *string `json:"assigneeId,omitempty"`
	Description *string `json:"description,omitempty"`
	Title       *string `json:"title,omitempty"`
	Points      *int    `json:"points,omitempty"`
	SprintId    *string `json:"sprintId,omitempty"`
}
