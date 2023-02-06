package sprints

import (
	"time"
)

type ISprintService interface {
	UpdateSprintName(sprintID string, newName string) SprintError
}

type SprintService struct {
	sprintRepo       SprintRepository
	sprintPointsRepo SprintPointsRepository
}

func NewSprintService(sprintRepo SprintRepository, sprintPointsRepo SprintPointsRepository) *SprintService {
	return &SprintService{
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func (service *SprintService) GetActiveSprintsOfProject(projectID string) ([]SprintInfo, error) {
	return service.sprintRepo.GetActiveSprintsOfProject(projectID)
}

type HasBackLog interface {
	IsBacklog() bool
	CreatedOn() time.Time
}

func (service SprintService) UpdateSprintIfNotBacklog(sprintID string, updateSprint _UpdateSprint) SprintError {
	sprintInfo, _ := service.sprintRepo.GetSprintInfo(sprintID)
	if sprintInfo.IsBacklog {
		return BuildSprintError(UnauthorizedToChangeBacklogSprint, nil)
	}
	return service.sprintRepo.UpdateSprint(sprintID, updateSprint)
}
