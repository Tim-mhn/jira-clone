package tasks_controllers

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/mock"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

var (
	projectID string = "id-of-project"
)

func TestGetTasksGroupedBySprintsOfProject(t *testing.T) {

	gin.SetMode(gin.TestMode)

	mockService := new(tasks_services.MockTasksQueriesService)
	controller := TasksController{
		sprintService: mockService,
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
		mockService.On("GetTasksGroupedBySprint", mock.Anything, mock.Anything).Return(tasks_dtos.SprintListWithTasksDTO{}, nil)

		router.ServeHTTP(responseRecorder, request)

		mockService.AssertCalled(t, "GetTasksGroupedBySprint", projectID, matchFiltersByAssigneeIds(expectedFilters.AssigneeIds))
	})

	t.Run("should correctly use the task status from the query params", func(t *testing.T) {
		request, allExpectedFilters := setupTestDataAndBuildRequest()

		expectedFilters := tasks_models.TaskFilters{
			TaskStatuses: allExpectedFilters.TaskStatuses,
		}

		mockService.On("GetTasksGroupedBySprint", mock.Anything, mock.Anything).Return(tasks_dtos.SprintListWithTasksDTO{}, nil)

		router.ServeHTTP(responseRecorder, request)

		mockService.AssertCalled(t, "GetTasksGroupedBySprint", projectID, matchFiltersByTaskStatusList(expectedFilters.TaskStatuses))
	})

	t.Run("should correctly use the task types from the query params", func(t *testing.T) {

		request, allExpectedFilters := setupTestDataAndBuildRequest()

		expectedFilters := tasks_models.TaskFilters{
			TaskTypes: allExpectedFilters.TaskTypes,
		}

		mockService.On("GetTasksGroupedBySprint", mock.Anything, mock.Anything).Return(tasks_dtos.SprintListWithTasksDTO{}, nil)

		router.ServeHTTP(responseRecorder, request)

		mockService.AssertCalled(t, "GetTasksGroupedBySprint", projectID, matchFiltersByTaskTypesList(expectedFilters.TaskTypes))
	})

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
