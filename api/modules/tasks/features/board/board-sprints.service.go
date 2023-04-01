package board

import (
	"sync"

	"github.com/tim-mhn/figma-clone/modules/sprints"
	sprint_points "github.com/tim-mhn/figma-clone/modules/sprints/points"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type BoardSprintsService struct {
	sprintRepo       sprints.SprintRepository
	tasksRepo        tasks_repositories.TaskQueriesRepository
	sprintPointsRepo sprint_points.SprintPointsRepository
}

func NewBoardSprintsService(sprintRepo sprints.SprintRepository, tasksRepo tasks_repositories.TaskQueriesRepository, sprintPointsRepo sprint_points.SprintPointsRepository) BoardSprintsService {
	return BoardSprintsService{
		sprintRepo:       sprintRepo,
		tasksRepo:        tasksRepo,
		sprintPointsRepo: sprintPointsRepo,
	}
}

func (service BoardSprintsService) GetBoardSprints(projectID string, taskFilters tasks_models.TaskFilters) (BoardSprints, error) {

	activeSprints, sprintsError := service.sprintRepo.GetActiveSprintsOfProject(projectID)

	if sprintsError != nil {
		return emptyBoardSprintsWithError(sprintsError)
	}

	var wg sync.WaitGroup
	wg.Add(len(activeSprints))

	var boardSprints BoardSprints

	sprintWithTasksChan := make(chan SprintWithTasks, len(activeSprints))

	for _, sprint := range activeSprints {
		go func(sprintInfo sprints.SprintInfo, c chan SprintWithTasks) {

			sprintWithTasks := service.buildSprintWithTasks(sprintInfo, taskFilters)
			c <- sprintWithTasks
			wg.Done()
		}(sprint, sprintWithTasksChan)
	}

	wg.Wait()
	close(sprintWithTasksChan)

	for sprintWithTasks := range sprintWithTasksChan {
		boardSprints = append(boardSprints, sprintWithTasks)
	}

	sortedBoardSprints := sortSprintsMostRecentFirst(boardSprints)

	return sortedBoardSprints, nil
}

// todo: ERROR HANDLING
func (service BoardSprintsService) buildSprintWithTasks(sprintInfo sprints.SprintInfo, taskFilters tasks_models.TaskFilters) SprintWithTasks {

	sprintTasksChan := make(chan []tasks_models.TaskWithSprint)
	pointsChan := make(chan sprint_points.SprintPointsBreakdown)

	go func() {
		sprintTasks, _ := service.tasksRepo.GetSprintTasks(sprintInfo.Id, taskFilters)
		sprintTasksChan <- sprintTasks
		close(sprintTasksChan)

	}()

	go func() {
		pointsBreakdown, _ := service.sprintPointsRepo.GetSprintPointsBreakdown(sprintInfo.Id)
		pointsChan <- pointsBreakdown
		close(pointsChan)
	}()

	sprintTasks := <-sprintTasksChan
	pointsBreakdown := <-pointsChan

	return SprintWithTasks{
		Sprint: sprints.Sprint{
			SprintInfo: sprintInfo,
			Points:     pointsBreakdown,
		},
		Tasks: sprintTasks,
	}
}

func emptyBoardSprintsWithError(err error) (BoardSprints, error) {
	return BoardSprints{}, err
}

func sortSprintsMostRecentFirst(sprintList BoardSprints) BoardSprints {

	// sprint2 will be after sprint1 is output is true
	moveBacklogAtTheEndFunc := func(sprint1 SprintWithTasks, sprint2 SprintWithTasks) bool {

		neitherIsBacklog := !sprint1.Sprint.IsBacklog && !sprint2.Sprint.IsBacklog

		if neitherIsBacklog {
			sprint2CreatedBeforeSprint1 := sprint2.Sprint.CreationTime.Before(sprint1.Sprint.CreationTime)
			return sprint2CreatedBeforeSprint1
		}

		return sprint2.Sprint.IsBacklog

	}

	return arrays.SortWithComparison(sprintList, moveBacklogAtTheEndFunc)
}
