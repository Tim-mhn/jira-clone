package sprints

import "github.com/go-playground/validator/v10"

type NewSprintDTO struct {
	Name string `json:"name" binding:"required"`
}

type UpdateSprintDTO = _UpdateSprint

type UpdateSprintCompletedDTO struct {
	Completed *bool `json:"completed" binding:"required"`
}

func UpdateSprintDTOAtLeastOneFieldValidator(sl validator.StructLevel) {

	dto := sl.Current().Interface().(UpdateSprintDTO)

	if dto.StartDate == nil && dto.EndDate == nil && dto.Name == nil {
		errorMessage := "Should have at least StartDate, EndDate or Name"
		sl.ReportError(nil, "", "errir", errorMessage, "")
	}

}

func (dto UpdateSprintDTO) hasAtLeastOneFieldNotEmpty() error {
	validate := validator.New()
	validate.RegisterStructValidation(UpdateSprintDTOAtLeastOneFieldValidator, UpdateSprintDTO{})
	err := validate.Struct(dto)
	return err
}
