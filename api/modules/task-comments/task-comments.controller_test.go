package task_comments

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

type mockCommentsRepository struct {
	mock.Mock
}

/**
** MAKE SURE TO HAVE A POINTER RECEIVING THE METHOD, otherwise Called() / AssertCalled works unexpectedly
 */
func (mockRepo *mockCommentsRepository) createComment(createComment CreateCommentInput) CommentsError {
	args := mockRepo.Called()
	return args.Get(0).(CommentsError)
}

func (mockRepo *mockCommentsRepository) getTaskComments(taskID string) (TaskComments, CommentsError) {
	args := mockRepo.Called(taskID)
	return args.Get(0).(TaskComments), args.Get(1).(CommentsError)
}

func TestPostCommentHttpCodes(t *testing.T) {

	gin.SetMode(gin.TestMode)

	testsData := []map[string]any{
		{
			"name":               "Should return 200 if the repo returns no error",
			"repoResponse":       NO_COMMENTS_ERROR(),
			"expectedStatusCode": http.StatusOK,
			"requestBody":        VALID_REQUEST_BODY(),
			"checkResponseBody":  true,
			"expectedResponse":   nil,
		},
		{
			"name":               "should return BAD REQUEST if the repo returns a TaskNotFound error",
			"repoResponse":       buildCommentsError(TaskNotFound, fmt.Errorf("task not found")),
			"expectedStatusCode": http.StatusBadRequest,
			"requestBody":        VALID_REQUEST_BODY(),
			"checkResponseBody":  false,
		},
		{
			"name":               "should return INTERNAL SERVER error if the repo returns OtherCommentError",
			"repoResponse":       buildCommentsError(OtherCommentError, fmt.Errorf("some internal error")),
			"expectedStatusCode": http.StatusInternalServerError,
			"checkResponseBody":  false,
			"requestBody":        VALID_REQUEST_BODY(),
		},
		{
			"name":               "should return BAD REQUEST error if the requestBody doesn't have text",
			"repoResponse":       NO_COMMENTS_ERROR(),
			"expectedStatusCode": http.StatusBadRequest,
			"requestBody":        INVALID_REQUEST_BODY(),
			"checkResponseBody":  false,
		},
	}

	getUserFromRequestContext = func(c *gin.Context) (*auth.User, error) {
		u := auth.User{}
		return &u, nil
	}

	for _, testData := range testsData {

		t.Run(testData["name"].(string), func(t *testing.T) {

			mockRepo := new(mockCommentsRepository)
			router, responseRecorder := setupRouterAndReturnRecorder(mockRepo)

			mockRepo.On("createComment").Return(testData["repoResponse"])

			req := buildPostCommentRequest(testData["requestBody"].(map[string]interface{}))
			router.ServeHTTP(responseRecorder, req)

			code := responseRecorder.Result().StatusCode
			expectedCode := testData["expectedStatusCode"]

			assert.Equal(t, expectedCode, code, fmt.Sprintf(`should return status code %d, got %d`, expectedCode, code))

			if testData["checkResponseBody"].(bool) {
				expectedResponseBody := testData["expectedResponse"]
				response := getResponseBody(*responseRecorder)
				assert.Equal(t, expectedResponseBody, response, "response does not match expected response")

			}
		})

	}

	t.Run("should return an instance of APIErrorResponse when the Request Body is invalid", func(t *testing.T) {
		mockRepo := new(mockCommentsRepository)
		router, responseRecorder := setupRouterAndReturnRecorder(mockRepo)

		mockRepo.Mock.On("createComment").Return(buildCommentsError(TaskNotFound, fmt.Errorf("task not found")))

		request := buildPostCommentRequest(INVALID_REQUEST_BODY())

		router.ServeHTTP(responseRecorder, request)

		responseBody := getResponseBody(*responseRecorder).(map[string]interface{})

		wrongField, err := typeOfResponseIsAPIResponse(responseBody)

		if err != nil {
			assert.NotNil(t, responseBody[wrongField], fmt.Sprintf(`apiResponse should have a %s field`, wrongField))

		}

	})

	t.Run("should return an instance of APIErrorResponse when the Repo returns an error", func(t *testing.T) {
		mockRepo := new(mockCommentsRepository)
		router, responseRecorder := setupRouterAndReturnRecorder(mockRepo)

		mockRepo.Mock.On("createComment").Return(buildCommentsError(TaskNotFound, fmt.Errorf("task not found")))

		request := buildPostCommentRequest(VALID_REQUEST_BODY())

		router.ServeHTTP(responseRecorder, request)

		responseBody := getResponseBody(*responseRecorder).(map[string]interface{})

		wrongField, err := typeOfResponseIsAPIResponse(responseBody)

		if err != nil {
			assert.NotNil(t, responseBody[wrongField], fmt.Sprintf(`apiResponse should have a %s field`, wrongField))

		}

	})

}

func TestGetTaskComments(t *testing.T) {

	t.Run("should call TaskCommentsRepository with route's taskID ", func(t *testing.T) {
		mockRepo := new(mockCommentsRepository)
		router, responseRecorder := setupRouterAndReturnRecorder(mockRepo)

		taskID := "some-random-id"
		request := buildGetCommentsRequest(taskID)

		mockRepo.On("getTaskComments", taskID).Return(nil)
		router.ServeHTTP(responseRecorder, request)

		mockRepo.AssertCalled(t, "getTaskComments", taskID)

	})

	t.Run("should return 404 NOT FOUND if taskID is empty string ", func(t *testing.T) {
		mockRepo := new(mockCommentsRepository)
		router, responseRecorder := setupRouterAndReturnRecorder(mockRepo)

		taskID := ""
		request := buildGetCommentsRequest(taskID)

		mockRepo.On("getTaskComments", taskID).Return(nil)
		router.ServeHTTP(responseRecorder, request)

		expectedCode := http.StatusNotFound

		assert.EqualValues(t, expectedCode, responseRecorder.Result().StatusCode, "should return BadRequest if taskID is empty string")

	})

	t.Run("should return BAD REQUEST if repo returns TaskNotFound ", func(t *testing.T) {
		mockRepo := new(mockCommentsRepository)
		router, responseRecorder := setupRouterAndReturnRecorder(mockRepo)

		taskID := "task-id-does-not-exist"
		request := buildGetCommentsRequest(taskID)

		mockRepo.On("getTaskComments", taskID).Return([]TaskComment{}, TASK_NOT_FOUND_ERROR(nil))
		router.ServeHTTP(responseRecorder, request)

		expectedCode := http.StatusBadRequest

		assert.EqualValues(t, expectedCode, responseRecorder.Result().StatusCode, "should return BadRequest if taskID doesn't exist")

	})
}

func buildPostCommentRequest(body map[string]interface{}) *http.Request {
	return http_utils.BuildRequest("POST", "/comments", body)
}

func buildGetCommentsRequest(taskID string) *http.Request {
	return http_utils.BuildRequest("GET", fmt.Sprintf("/%s/comments", taskID), nil)
}

func VALID_REQUEST_BODY() map[string]interface{} {
	return map[string]interface{}{"text": "my test"}
}

func INVALID_REQUEST_BODY() map[string]interface{} {
	return map[string]interface{}{"wrong-property": "my test"}

}

func TASK_NOT_FOUND_ERROR(source error) CommentsError {
	return buildCommentsError(TaskNotFound, source)
}
func typeOfResponseIsAPIResponse(responseBody map[string]interface{}) (string, error) {
	apiResponse := shared_errors.BuildAPIErrorFromDomainError(buildCommentsError(TaskNotFound, nil))

	v := reflect.ValueOf(apiResponse)
	for i := 0; i < v.NumField(); i++ {
		f := v.Type().Field(i)
		fieldName := f.Name
		hasField := responseBody[fieldName] != nil
		if !hasField {
			return fieldName, fmt.Errorf("response is missing field")
		}

	}

	return "", nil
}

func setupRouterAndReturnRecorder(mockRepo *mockCommentsRepository) (*gin.Engine, *httptest.ResponseRecorder) {
	responseRecorder := httptest.NewRecorder()

	router := gin.Default()
	controller := TaskCommentsController{
		repo: mockRepo,
	}
	router.POST("/comments", controller.postComment)
	router.GET("/:taskID/comments", controller.getTaskComments)

	return router, responseRecorder
}

func getResponseBody(responseRecorder httptest.ResponseRecorder) interface{} {
	responseBody := responseRecorder.Result().Body
	var response interface{}

	json.NewDecoder(responseBody).Decode(&response)

	return response
}
