package sprints

type NewSprintDTO struct {
	Name string `json:"name" binding:"required"`
}

type UpdateSprintDTO = _UpdateSprint
