package tasks_services

import (
	"log"

	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"

	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type SprintService struct {
	taskRepo         *tasks_repositories.TaskQueriesRepository
	sprintRepo       *tasks_repositories.SprintRepository
	sprintPointsRepo *tasks_repositories.SprintPointsRepository
}

func NewSprintService(taskRepo *tasks_repositories.TaskQueriesRepository, sprintRepo *tasks_repositories.SprintRepository, sprintPointsRepo *tasks_repositories.SprintPointsRepository) *SprintService {
	return &SprintService{
		taskRepo:         taskRepo,
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func (service *SprintService) GetSprintListWithTasks(projectID string) (tasks_dtos.SprintListWithTasksDTO, error) {
	sprintList, err := service.sprintRepo.GetSprintsOfProject(projectID)

	sortedSprints := moveBacklogSprintAtTheEnd(sprintList)

	if err != nil {
		return tasks_dtos.SprintListWithTasksDTO{}, err
	}

	var sprintListWithTasks tasks_dtos.SprintListWithTasksDTO

	for _, sprint := range sortedSprints {

		//todo: execute these in parallel
		sprintTasks, err := service.taskRepo.GetSprintTasks(sprint.Id)

		pointsBreakdown, _ := service.sprintPointsRepo.GetSprintPointsBreakdown(sprint.Id)

		log.Default().Print(pointsBreakdown)

		if err != nil {
			return tasks_dtos.SprintListWithTasksDTO{}, err
		}

		sprintWithTasks := tasks_dtos.SprintWithTasks{
			Tasks: sprintTasks,
			Sprint: tasks_models.Sprint{
				SprintInfo: sprint,
				Points:     pointsBreakdown,
			},
		}

		sprintListWithTasks = append(sprintListWithTasks, sprintWithTasks)

	}

	return sprintListWithTasks, nil
}

func moveBacklogSprintAtTheEnd(sprintList []tasks_models.SprintInfo) []tasks_models.SprintInfo {
	backlogLastSortFunction := func(s1 tasks_models.SprintInfo, s2 tasks_models.SprintInfo) bool {
		return s2.IsBacklog
	}

	return arrays.SortWithComparison(sprintList, backlogLastSortFunction)
}
