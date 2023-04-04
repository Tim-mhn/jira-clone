package board

import (
	"sync"

	"github.com/tim-mhn/figma-clone/modules/sprints"
	sprint_points "github.com/tim-mhn/figma-clone/modules/sprints/points"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_queries "github.com/tim-mhn/figma-clone/modules/tasks/queries"

	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type BoardSprintsService struct {
	sprintRepo       sprints.SprintRepository
	tasksQueries     tasks_queries.ITasksQueriesService
	sprintPointsRepo sprint_points.SprintPointsRepository
}

func NewBoardSprintsService(sprintRepo sprints.SprintRepository, sprintPointsRepo sprint_points.SprintPointsRepository, taskQueriesService tasks_queries.ITasksQueriesService) BoardSprintsService {

	return BoardSprintsService{
		sprintRepo:       sprintRepo,
		sprintPointsRepo: sprintPointsRepo,
		tasksQueries:     taskQueriesService,
	}
}

func (service BoardSprintsService) GetBoardSprints(projectID string, taskFilters tasks_models.TaskFilters) (BoardSprints, error) {

	activeSprints, sprintsError := service.sprintRepo.GetActiveSprintsOfProject(projectID)

	if sprintsError != nil {
		return emptyBoardSprintsWithError(sprintsError)
	}

	var wg sync.WaitGroup
	wg.Add(len(activeSprints))

	errorsChan := make(chan error, len(activeSprints))
	sprintWithTasksChan := make(chan SprintWithTasks, len(activeSprints))

	for _, sprint := range activeSprints {
		go func(sprintInfo sprints.SprintInfo, c chan SprintWithTasks) {

			sprintWithTasks, err := service.buildSprintWithTasks(sprintInfo, taskFilters)
			errorsChan <- err
			c <- sprintWithTasks
			wg.Done()
		}(sprint, sprintWithTasksChan)
	}

	wg.Wait()
	close(errorsChan)
	close(sprintWithTasksChan)

	sprintTasksError := retrieveErrorFromErrorChannel(errorsChan)
	boardSprints := buildSprintWithTasksListFromChannel(sprintWithTasksChan)

	sortedBoardSprints := sortSprintsMostRecentFirst(boardSprints)

	return sortedBoardSprints, sprintTasksError
}

func retrieveErrorFromErrorChannel(errorChan chan error) error {
	for err := range errorChan {
		if err != nil {
			return err
		}
	}

	return nil
}

func buildSprintWithTasksListFromChannel(sprintWithTasksChan chan SprintWithTasks) BoardSprints {
	var boardSprints BoardSprints

	for sprintWithTasks := range sprintWithTasksChan {
		boardSprints = append(boardSprints, sprintWithTasks)
	}

	return boardSprints
}

func (service BoardSprintsService) buildSprintWithTasks(sprintInfo sprints.SprintInfo, taskFilters tasks_models.TaskFilters) (SprintWithTasks, error) {

	sprintTasksChan := make(chan []tasks_models.Task)
	pointsChan := make(chan sprint_points.SprintPointsBreakdown)
	errorChan := make(chan error, 2)
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		sprintTasks, tasksError := service.tasksQueries.GetSprintTasks(sprintInfo.Id, taskFilters)
		sprintTasksChan <- sprintTasks
		errorChan <- tasksError
		wg.Done()
		close(sprintTasksChan)

	}()

	go func() {
		pointsBreakdown, pointsError := service.sprintPointsRepo.GetSprintPointsBreakdown(sprintInfo.Id)
		pointsChan <- pointsBreakdown
		errorChan <- pointsError
		wg.Done()
		close(pointsChan)
	}()

	sprintTasks := <-sprintTasksChan
	pointsBreakdown := <-pointsChan
	wg.Wait()
	close(errorChan)
	err := retrieveErrorFromErrorChannel(errorChan)

	return SprintWithTasks{
		Sprint: sprints.Sprint{
			SprintInfo: sprintInfo,
			Points:     pointsBreakdown,
		},
		Tasks: sprintTasks,
	}, err
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
