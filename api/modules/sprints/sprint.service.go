package sprints

import (
	"time"

	"github.com/tim-mhn/figma-clone/utils/arrays"
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

func (service SprintService) UpdateSprintName(sprintID string, newName string) SprintError {
	sprintInfo, _ := service.sprintRepo.GetSprintInfo(sprintID)
	if sprintInfo.IsBacklog {
		return BuildSprintError(UnauthorizedToChangeBacklogSprint, nil)
	}
	return service.sprintRepo.UpdateSprint(sprintID, newName)
}

func moveBacklogSprintAtTheEnd[T HasBackLog](sprints []T) []T {

	// sprint2 will be after sprint1 is output is true
	moveBacklogAtTheEndFunc := func(sprint1 T, sprint2 T) bool {

		neitherIsBacklog := !sprint1.IsBacklog() && !sprint2.IsBacklog()

		if neitherIsBacklog {
			sprint2CreatedBeforeSprint1 := sprint2.CreatedOn().Before(sprint1.CreatedOn())
			return sprint2CreatedBeforeSprint1
		}

		return sprint2.IsBacklog()

	}

	return arrays.SortWithComparison(sprints, moveBacklogAtTheEndFunc)
}
