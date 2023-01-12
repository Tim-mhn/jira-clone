package services

import (
	"log"

	"github.com/tim-mhn/figma-clone/dtos"
	"github.com/tim-mhn/figma-clone/models"
	"github.com/tim-mhn/figma-clone/repositories"
	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type SprintService struct {
	taskRepo         *repositories.TaskQueriesRepository
	sprintRepo       *repositories.SprintRepository
	sprintPointsRepo *repositories.SprintPointsRepository
}

func NewSprintService(taskRepo *repositories.TaskQueriesRepository, sprintRepo *repositories.SprintRepository, sprintPointsRepo *repositories.SprintPointsRepository) *SprintService {
	return &SprintService{
		taskRepo:         taskRepo,
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func (service *SprintService) GetSprintListWithTasks(projectID string) (dtos.SprintListWithTasksDTO, error) {
	sprintList, err := service.sprintRepo.GetSprintsOfProject(projectID)

	sortedSprints := moveBacklogSprintAtTheEnd(sprintList)

	if err != nil {
		return dtos.SprintListWithTasksDTO{}, err
	}

	var sprintListWithTasks dtos.SprintListWithTasksDTO

	for _, sprint := range sortedSprints {

		//todo: execute these in parallel
		sprintTasks, err := service.taskRepo.GetSprintTasks(sprint.Id)

		pointsBreakdown, _ := service.sprintPointsRepo.GetSprintPointsBreakdown(sprint.Id)

		log.Default().Print(pointsBreakdown)

		if err != nil {
			return dtos.SprintListWithTasksDTO{}, err
		}

		sprintWithTasks := dtos.SprintWithTasks{
			Tasks: sprintTasks,
			Sprint: models.Sprint{
				SprintInfo: sprint,
				Points:     pointsBreakdown,
			},
		}

		sprintListWithTasks = append(sprintListWithTasks, sprintWithTasks)

	}

	return sprintListWithTasks, nil
}

func moveBacklogSprintAtTheEnd(sprintList []models.SprintInfo) []models.SprintInfo {
	backlogLastSortFunction := func(s1 models.SprintInfo, s2 models.SprintInfo) bool {
		return s2.IsBacklog
	}

	return arrays.SortWithComparison(sprintList, backlogLastSortFunction)
}
