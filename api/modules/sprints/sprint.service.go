package sprints

import (
	"time"

	sprint_points "github.com/tim-mhn/figma-clone/modules/sprints/points"
)

type ISprintService interface {
	UpdateSprintName(sprintID string, newName string) SprintError
	GetSprintDetails(sprintID string) (Sprint, SprintError)
}

type SprintService struct {
	sprintRepo       SprintRepository
	sprintPointsRepo sprint_points.SprintPointsRepository
}

func NewSprintService(sprintRepo SprintRepository, sprintPointsRepo sprint_points.SprintPointsRepository) *SprintService {
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

func (service SprintService) UpdateSprintIfNotBacklog(sprintID string, updateSprint UpdateSprint) SprintError {
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

	pointsBreakdown, pointsBreakdownError := service.sprintPointsRepo.GetSprintPointsBreakdown(sprintID)

	if pointsBreakdownError != nil {
		return Sprint{}, BuildSprintError(OtherSprintError, pointsBreakdownError)
	}

	sprint := Sprint{
		sprintInfo,
		pointsBreakdown,
	}

	return sprint, NoSprintError()
}
