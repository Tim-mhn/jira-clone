package board

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	sprint_points "github.com/tim-mhn/figma-clone/modules/sprints/points"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	"github.com/tim-mhn/figma-clone/utils/arrays"
	"github.com/tim-mhn/figma-clone/utils/primitives"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

func TestGetBoardSprints(t *testing.T) {

	PROJECT_ID := "project-id-123-xyz"
	SPRINT_1_ID := "sprint-1"
	SPRINT_2_ID := "sprint-2"

	SPRINT_1 := sprints.SprintInfo{
		Id:           SPRINT_1_ID,
		Name:         "Sprint 1",
		Completed:    false,
		CreationTime: time.Date(2022, 12, 4, 0, 0, 0, 0, time.Local),
	}

	SPRINT_2 := sprints.SprintInfo{
		Id:           SPRINT_2_ID,
		Name:         "Sprint 2",
		Completed:    false,
		CreationTime: time.Date(2022, 10, 4, 0, 0, 0, 0, time.Local),
	}

	BACKLOG_SPRINT := sprints.SprintInfo{
		Id:   "backlog-sprint-xyz",
		Name: "Backlog",
	}
	MOCK_SPRINTS := []sprints.SprintInfo{
		SPRINT_1, SPRINT_2,
	}

	t.Run("it should return as many items as active sprints returned from the SprintRepo", func(t *testing.T) {

		service, mockTasksRepo, mockSprintsRepo, mockSprintPointsRepo := setupServiceWithMockRepos()

		mockSprintsRepo.On("GetActiveSprintsOfProject", PROJECT_ID).Return(MOCK_SPRINTS, nil)
		mockTasksRepo.On("GetSprintTasks", mock.Anything).Return([]tasks_models.TaskWithSprint{}, nil)
		mockSprintPointsRepo.On("GetSprintPointsBreakdown", mock.Anything).Return(sprint_points.SprintPointsBreakdown{}, nil)
		boardSprints, _ := service.GetBoardSprints(PROJECT_ID, tasks_models.TaskFilters{})

		assert.Equal(t, 2, len(boardSprints))
	})

	t.Run("it should return an error if there is an error in the SprintRepo returns an error", func(t *testing.T) {
		service, mockTasksRepo, mockSprintsRepo, mockSprintPointsRepo := setupServiceWithMockRepos()

		mockSprintsRepo.On("GetActiveSprintsOfProject", PROJECT_ID).Return(MOCK_SPRINTS, fmt.Errorf("error in GetActiveSprintsOfProject"))
		mockTasksRepo.On("GetSprintTasks", mock.Anything).Return([]tasks_models.TaskWithSprint{}, nil)
		mockSprintPointsRepo.On("GetSprintPointsBreakdown", mock.Anything).Return(sprint_points.SprintPointsBreakdown{}, nil)

		_, err := service.GetBoardSprints(PROJECT_ID, tasks_models.TaskFilters{})

		assert.NotNil(t, err, "should return an error if SprintRepo returns an error")

	})

	t.Run("it should return the list of correct tasks for each active sprint", func(t *testing.T) {
		service, mockTasksRepo, mockSprintsRepo, mockSprintPointsRepo := setupServiceWithMockRepos()
		mockSprintsRepo.On("GetActiveSprintsOfProject", PROJECT_ID).Return(MOCK_SPRINTS, nil)
		mockSprintPointsRepo.On("GetSprintPointsBreakdown", mock.Anything).Return(sprint_points.SprintPointsBreakdown{}, nil)

		tasksOfSprint1 := []tasks_models.TaskWithSprint{
			{
				Sprint: SPRINT_1,
				Task: tasks_models.Task{
					Id:    primitives.CreateStringPointer("task-a"),
					Title: primitives.CreateStringPointer("task a "),
				},
			},
			{
				Sprint: SPRINT_1,
				Task: tasks_models.Task{
					Id:    primitives.CreateStringPointer("task-b"),
					Title: primitives.CreateStringPointer("task b "),
				},
			},
			{
				Sprint: SPRINT_1,
				Task: tasks_models.Task{
					Id:    primitives.CreateStringPointer("task-c"),
					Title: primitives.CreateStringPointer("task c "),
				},
			},
		}

		tasksOfSprint2 := []tasks_models.TaskWithSprint{
			{Sprint: SPRINT_2,
				Task: tasks_models.Task{
					Id:    primitives.CreateStringPointer("task-d"),
					Title: primitives.CreateStringPointer("task d"),
				},
			},
		}

		mockTasksRepo.On("GetSprintTasks", SPRINT_1_ID).Return(tasksOfSprint1, nil)
		mockTasksRepo.On("GetSprintTasks", SPRINT_2_ID).Return(tasksOfSprint2, nil)

		boardSprints, _ := service.GetBoardSprints(PROJECT_ID, tasks_models.TaskFilters{})

		tasksListOfList := arrays.MapArray(boardSprints, func(s SprintWithTasks) []tasks_models.Task {
			return arrays.MapArray(s.Tasks, func(sWithSprint tasks_models.TaskWithSprint) tasks_models.Task {
				return sWithSprint.Task
			})
		})

		allTasks := arrays.Flatten(tasksListOfList)

		assert.Equal(t, 4, len(allTasks))

	})

	t.Run("it should return the correct point breakdown for each sprint", func(t *testing.T) {
		service, mockTasksRepo, mockSprintsRepo, mockSprintPointsRepo := setupServiceWithMockRepos()

		sprint1PointsBreakdown := sprint_points.SprintPointsBreakdown{
			New:        4,
			InProgress: 15,
			Done:       8,
		}

		sprint2PointsBreakdown := sprint_points.SprintPointsBreakdown{
			New:        0,
			InProgress: 20,
			Done:       4,
		}
		mockSprintsRepo.On("GetActiveSprintsOfProject", PROJECT_ID).Return(MOCK_SPRINTS, nil)
		mockSprintPointsRepo.On("GetSprintPointsBreakdown", SPRINT_1_ID).Return(sprint1PointsBreakdown, nil)
		mockSprintPointsRepo.On("GetSprintPointsBreakdown", SPRINT_2_ID).Return(sprint2PointsBreakdown, nil)

		mockTasksRepo.On("GetSprintTasks", mock.Anything).Return([]tasks_models.TaskWithSprint{}, nil)

		boardSprints, _ := service.GetBoardSprints(PROJECT_ID, tasks_models.TaskFilters{})

		sprint1, _ := arrays.Find(boardSprints, func(sWTasks SprintWithTasks) bool {
			return sWTasks.Sprint.Id == SPRINT_1_ID
		})

		sprint1PointsResult := sprint1.Sprint.Points

		sprint2, _ := arrays.Find(boardSprints, func(sWTasks SprintWithTasks) bool {
			return sWTasks.Sprint.Id == SPRINT_2_ID
		})

		sprint2PointsResult := sprint2.Sprint.Points

		assert.EqualValues(t, sprint1PointsBreakdown, sprint1PointsResult)
		assert.EqualValues(t, sprint2PointsBreakdown, sprint2PointsResult)

	})

	t.Run("it should correctly order the sprints (latest created first and backlog at the end)", func(t *testing.T) {
		service, mockTasksRepo, mockSprintsRepo, mockSprintPointsRepo := setupServiceWithMockRepos()

		sprints := []sprints.SprintInfo{
			SPRINT_2, BACKLOG_SPRINT, SPRINT_1,
		}

		mockSprintsRepo.On("GetActiveSprintsOfProject", PROJECT_ID).Return(sprints, nil)
		mockTasksRepo.On("GetSprintTasks", mock.Anything).Return([]tasks_models.TaskWithSprint{}, nil)
		mockSprintPointsRepo.On("GetSprintPointsBreakdown", mock.Anything).Return(sprint_points.SprintPointsBreakdown{}, nil)

		boardSprints, _ := service.GetBoardSprints(PROJECT_ID, tasks_models.TaskFilters{})

		sprintIds := arrays.MapArray(boardSprints, func(sprintWithTasks SprintWithTasks) string {
			return sprintWithTasks.Sprint.Id
		})

		expectedSortedSprintIds := []string{SPRINT_1_ID, SPRINT_2_ID, BACKLOG_SPRINT.Id}

		assert.EqualValues(t, expectedSortedSprintIds, sprintIds)

	})

}

func setupServiceWithMockRepos() (BoardSprintsService, *tasks_repositories.MockTaskQueriesRepository, *MockSprintsRepo, *MockSprintPointsRepository) {
	mockSprintsRepo := new(MockSprintsRepo)
	mockTasksRepo := new(tasks_repositories.MockTaskQueriesRepository)
	mockSprintPointsRepo := new(MockSprintPointsRepository)
	service := NewBoardSprintsService(mockSprintsRepo, mockTasksRepo, mockSprintPointsRepo)

	return service, mockTasksRepo, mockSprintsRepo, mockSprintPointsRepo

}

type MockSprintsRepo struct {
	mock.Mock
}

func (repo *MockSprintsRepo) GetActiveSprintsOfProject(projectID string) ([]sprints.SprintInfo, error) {
	args := repo.Called(projectID)
	errorOrNil := tests_utils.CastToErrorIfNotNil(args.Get(1))

	return args.Get(0).([]sprints.SprintInfo), errorOrNil
}
func (repo *MockSprintsRepo) CreateSprint(name string, projectID string) (string, error) {
	return "", nil
}
func (repo *MockSprintsRepo) DeleteSprint(sprintID string) error {
	return nil
}
func (repo *MockSprintsRepo) UpdateSprint(sprintID sprints.SprintID, updateSprint sprints.UpdateSprint) sprints.SprintError {
	return sprints.NoSprintError()
}
func (repo *MockSprintsRepo) UpdateCompletedStatus(sprintID string, isCompleted bool) error {
	return nil
}
func (repo *MockSprintsRepo) GetSprintInfo(sprintID string) (sprints.SprintInfo, sprints.SprintError) {
	return sprints.SprintInfo{}, sprints.NoSprintError()
}

type MockSprintPointsRepository struct {
	mock.Mock
}

func (pointsRepo *MockSprintPointsRepository) GetSprintPointsBreakdown(sprintID string) (sprint_points.SprintPointsBreakdown, error) {
	args := pointsRepo.Called(sprintID)
	return args.Get(0).(sprint_points.SprintPointsBreakdown), tests_utils.CastToErrorIfNotNil(args.Get(1))

}
