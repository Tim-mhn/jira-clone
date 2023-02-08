package sprints

import (
	"time"
)

type ISprintService interface {
	UpdateSprintName(sprintID string, newName string) SprintError
	GetSprintDetails(sprintID string) (Sprint, SprintError)
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

func (service SprintService) GetSprintDetails(sprintID string) (Sprint, SprintError) {
	sprintInfo, err := service.sprintRepo.GetSprintInfo(sprintID)

	if err.HasError {
		return Sprint{}, err
	}

	pointsBreakdown, err := service.sprintPointsRepo.GetSprintPointsBreakdown(sprintID)

	if err.HasError {
		return Sprint{}, err
	}

	sprint := Sprint{
		sprintInfo,
		pointsBreakdown,
	}

	return sprint, NoSprintError()
}
