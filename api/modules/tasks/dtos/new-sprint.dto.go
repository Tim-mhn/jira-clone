package tasks_dtos

type NewSprintDTO struct {
	Name string `json:"name" binding:"required"`
}

type UpdateSprintDTO = NewSprintDTO
