package services

import (
	"github.com/tim-mhn/figma-clone/dtos"
	"github.com/tim-mhn/figma-clone/models"
	"github.com/tim-mhn/figma-clone/repositories"
	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type SprintService struct {
	taskRepo   *repositories.TaskQueriesRepository
	sprintRepo *repositories.SprintRepository
}

func NewSprintService(taskRepo *repositories.TaskQueriesRepository, sprintRepo *repositories.SprintRepository) *SprintService {
	return &SprintService{
		taskRepo:   taskRepo,
		sprintRepo: sprintRepo,
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
		sprintTasks, err := service.taskRepo.GetSprintTasks(sprint.Id)

		if err != nil {
			return dtos.SprintListWithTasksDTO{}, err
		}

		sprintWithTasks := dtos.SprintWithTasks{
			Tasks:  sprintTasks,
			Sprint: sprint,
		}

		sprintListWithTasks = append(sprintListWithTasks, sprintWithTasks)

	}

	return sprintListWithTasks, nil
}

func moveBacklogSprintAtTheEnd(sprintList []models.Sprint) []models.Sprint {
	backlogLastSortFunction := func(s1 models.Sprint, s2 models.Sprint) bool {
		return s2.IsBacklog
	}

	return arrays.SortWithComparison(sprintList, backlogLastSortFunction)
}
