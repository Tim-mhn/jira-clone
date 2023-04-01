package tasks_controllers

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/board"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

var (
	projectID string = "id-of-project"
)

func TestGetTasksGroupedBySprintsOfProject(t *testing.T) {

	gin.SetMode(gin.TestMode)

	mockBoardSprintsService := new(MockBoardSprintsService)
	controller := TasksController{
		boardSprintsService: mockBoardSprintsService,
	}

	responseRecorder := httptest.NewRecorder()

	router := http_utils.SetupMockRouterAndRegisterEndpoint(
		http_utils.GET,
		"/projects/:projectID/tasks",
		controller.GetTasksGroupedBySprintsOfProject)

	t.Run("should correctly use the assigneeIds from the query params", func(t *testing.T) {
		request, allExpectedFilters := setupTestDataAndBuildRequest()

		expectedFilters := tasks_models.TaskFilters{
			AssigneeIds: allExpectedFilters.AssigneeIds,
		}
		mockBoardSprintsService.On("GetBoardSprints", mock.Anything, mock.Anything).Return(board.BoardSprints{}, nil)

		router.ServeHTTP(responseRecorder, request)

		mockBoardSprintsService.AssertCalled(t, "GetBoardSprints", projectID, matchFiltersByAssigneeIds(expectedFilters.AssigneeIds))
	})

	t.Run("should correctly use the task status from the query params", func(t *testing.T) {
		request, allExpectedFilters := setupTestDataAndBuildRequest()

		expectedFilters := tasks_models.TaskFilters{
			TaskStatuses: allExpectedFilters.TaskStatuses,
		}

		mockBoardSprintsService.On("GetBoardSprints", mock.Anything, mock.Anything).Return(board.BoardSprints{}, nil)

		router.ServeHTTP(responseRecorder, request)

		mockBoardSprintsService.AssertCalled(t, "GetBoardSprints", projectID, matchFiltersByTaskStatusList(expectedFilters.TaskStatuses))
	})

	t.Run("should correctly use the task types from the query params", func(t *testing.T) {

		request, allExpectedFilters := setupTestDataAndBuildRequest()

		expectedFilters := tasks_models.TaskFilters{
			TaskTypes: allExpectedFilters.TaskTypes,
		}

		mockBoardSprintsService.On("GetBoardSprints", mock.Anything, mock.Anything).Return(board.BoardSprints{}, nil)

		router.ServeHTTP(responseRecorder, request)

		mockBoardSprintsService.AssertCalled(t, "GetBoardSprints", projectID, matchFiltersByTaskTypesList(expectedFilters.TaskTypes))
	})

}

type MockBoardSprintsService struct {
	mock.Mock
}

func (boardSprintsService *MockBoardSprintsService) GetBoardSprints(projectID string, taskFilters tasks_models.TaskFilters) (board.BoardSprints, error) {

	args := boardSprintsService.Called(projectID, taskFilters)

	err := tests_utils.CastToErrorIfNotNil(args.Get(1))

	return args.Get(0).(board.BoardSprints), err

}

var matchFiltersByAssigneeIds = func(expectedAssigneeIds []string) interface{} {
	return mock.MatchedBy(func(filters tasks_models.TaskFilters) bool {
		return reflect.DeepEqual(filters.AssigneeIds, expectedAssigneeIds)
	})
}

var matchFiltersByTaskStatusList = func(expectedStatusList []int) interface{} {
	return mock.MatchedBy(func(filters tasks_models.TaskFilters) bool {
		return reflect.DeepEqual(filters.TaskStatuses, expectedStatusList)
	})
}

var matchFiltersByTaskTypesList = func(expectedTypes []int) interface{} {
	return mock.MatchedBy(func(filters tasks_models.TaskFilters) bool {
		return reflect.DeepEqual(filters.TaskTypes, expectedTypes)
	})
}

func setupTestDataAndBuildRequest() (*http.Request, tasks_models.TaskFilters) {
	assigneeIds := []string{"assignee-1", "assignee-2"}
	taskStatusList := []int{2, 3, 1}
	taskTypes := []int{3, 5, 0, 1}

	expectedFilters := tasks_models.TaskFilters{
		AssigneeIds:  assigneeIds,
		TaskStatuses: taskStatusList,
		TaskTypes:    taskTypes,
	}
	request := http_utils.BuildRequest(http_utils.GET,
		fmt.Sprintf(`/projects/%s/tasks?assigneeId[]=%s&assigneeId[]=%s&status[]=%d&status[]=%d&status[]=%d&type[]=%d&type[]=%d&type[]=%d&type[]=%d`,
			projectID,
			assigneeIds[0], assigneeIds[1],
			taskStatusList[0], taskStatusList[1], taskStatusList[2],
			taskTypes[0], taskTypes[1], taskTypes[2], taskTypes[3]),
		nil)

	return request, expectedFilters
}
