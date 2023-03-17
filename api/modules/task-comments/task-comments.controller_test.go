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

type _MockCommentsService struct {
	mock.Mock
}

/**
** MAKE SURE TO HAVE A POINTER RECEIVING THE METHOD, otherwise Called() / AssertCalled works unexpectedly
 */
func (mockService *_MockCommentsService) postComment(postComment CreateCommentInput, author auth.User, authCookie *http.Cookie) CommentsError {
	args := mockService.Called()
	return args.Get(0).(CommentsError)
}

func (mockService *_MockCommentsService) getTaskComments(taskID string) (TaskComments, CommentsError) {
	args := mockService.Called(taskID)
	return args.Get(0).(TaskComments), args.Get(1).(CommentsError)
}

func (mockService *_MockCommentsService) deleteComment(commentID string) CommentsError {
	return NO_COMMENTS_ERROR()
}

func (mockService *_MockCommentsService) editCommentText(editComment EditCommentInput) CommentsError {
	return NO_COMMENTS_ERROR()
}

func TestPostCommentHttpCodes(t *testing.T) {

	gin.SetMode(gin.TestMode)

	testsData := []map[string]any{
		{
			"name":               "Should return 200 if the repo returns no error",
			"repoResponse":       NO_COMMENTS_ERROR(),
			"expectedStatusCode": http.StatusOK,
			"requestBody":        VALID_POST_EDIT_COMMENT_BODY(),
			"checkResponseBody":  true,
			"expectedResponse":   nil,
		},
		{
			"name":               "should return BAD REQUEST if the repo returns a TaskNotFound error",
			"repoResponse":       buildCommentsError(TaskNotFound, fmt.Errorf("task not found")),
			"expectedStatusCode": http.StatusBadRequest,
			"requestBody":        VALID_POST_EDIT_COMMENT_BODY(),
			"checkResponseBody":  false,
		},
		{
			"name":               "should return INTERNAL SERVER error if the repo returns OtherCommentError",
			"repoResponse":       buildCommentsError(OtherCommentError, fmt.Errorf("some internal error")),
			"expectedStatusCode": http.StatusInternalServerError,
			"checkResponseBody":  false,
			"requestBody":        VALID_POST_EDIT_COMMENT_BODY(),
		},
		{
			"name":               "should return BAD REQUEST error if the requestBody doesn't have text",
			"repoResponse":       NO_COMMENTS_ERROR(),
			"expectedStatusCode": http.StatusBadRequest,
			"requestBody":        INVALID_POST_EDIT_COMMENT_BODY(),
			"checkResponseBody":  false,
		},
	}

	getUserFromRequestContext = func(c *gin.Context) (*auth.User, error) {
		u := auth.User{}
		return &u, nil
	}

	for _, testData := range testsData {

		t.Run(testData["name"].(string), func(t *testing.T) {

			mockService := new(_MockCommentsService)
			router, responseRecorder := setupRouterAndReturnRecorder(mockService)

			mockService.On("postComment").Return(testData["repoResponse"])

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
		mockService := new(_MockCommentsService)
		router, responseRecorder := setupRouterAndReturnRecorder(mockService)

		mockService.Mock.On("postComment").Return(buildCommentsError(TaskNotFound, fmt.Errorf("task not found")))

		request := buildPostCommentRequest(INVALID_POST_EDIT_COMMENT_BODY())

		router.ServeHTTP(responseRecorder, request)

		responseBody := getResponseBody(*responseRecorder).(map[string]interface{})

		wrongField, err := typeOfResponseIsAPIResponse(responseBody)

		if err != nil {
			assert.NotNil(t, responseBody[wrongField], fmt.Sprintf(`apiResponse should have a %s field`, wrongField))

		}

	})

	t.Run("should return an instance of APIErrorResponse when the Service returns an error", func(t *testing.T) {
		mockService := new(_MockCommentsService)
		router, responseRecorder := setupRouterAndReturnRecorder(mockService)

		mockService.Mock.On("postComment").Return(buildCommentsError(TaskNotFound, fmt.Errorf("task not found")))

		request := buildPostCommentRequest(VALID_POST_EDIT_COMMENT_BODY())

		router.ServeHTTP(responseRecorder, request)

		responseBody := getResponseBody(*responseRecorder).(map[string]interface{})

		wrongField, err := typeOfResponseIsAPIResponse(responseBody)

		if err != nil {
			assert.NotNil(t, responseBody[wrongField], fmt.Sprintf(`apiResponse should have a %s field`, wrongField))

		}

	})

}

func TestGetTaskComments(t *testing.T) {

	t.Run("should call TaskCommentsServicesitory with route's taskID ", func(t *testing.T) {
		mockService := new(_MockCommentsService)
		router, responseRecorder := setupRouterAndReturnRecorder(mockService)

		taskID := "some-random-id"
		request := buildGetCommentsRequest(taskID)

		mockService.On("getTaskComments", taskID).Return([]TaskComment{}, NO_COMMENTS_ERROR())
		router.ServeHTTP(responseRecorder, request)

		mockService.AssertCalled(t, "getTaskComments", taskID)

	})

	t.Run("should return 404 NOT FOUND if taskID is empty string ", func(t *testing.T) {
		mockService := new(_MockCommentsService)
		router, responseRecorder := setupRouterAndReturnRecorder(mockService)

		taskID := ""
		request := buildGetCommentsRequest(taskID)

		mockService.On("getTaskComments", taskID).Return([]TaskComment{}, NO_COMMENTS_ERROR())
		router.ServeHTTP(responseRecorder, request)

		expectedCode := http.StatusNotFound

		assert.EqualValues(t, expectedCode, responseRecorder.Result().StatusCode, "should return BadRequest if taskID is empty string")

	})

	t.Run("should return BAD REQUEST if repo returns TaskNotFound ", func(t *testing.T) {
		mockService := new(_MockCommentsService)
		router, responseRecorder := setupRouterAndReturnRecorder(mockService)

		taskID := "task-id-does-not-exist"
		request := buildGetCommentsRequest(taskID)

		mockService.On("getTaskComments", taskID).Return([]TaskComment{}, TASK_NOT_FOUND_ERROR(nil))
		router.ServeHTTP(responseRecorder, request)

		expectedCode := http.StatusBadRequest

		assert.EqualValues(t, expectedCode, responseRecorder.Result().StatusCode, "should return BadRequest if taskID doesn't exist")

	})
}

func TestControllerEditComment(t *testing.T) {

	gin.SetMode(gin.TestMode)

	t.Run("should return an InvalidPayloadError if commentID is empty string in endpoint", func(t *testing.T) {
		mockService := new(_MockCommentsService)
		router, responseRecorder := setupRouterAndReturnRecorder(mockService)

		request := http_utils.BuildRequest(http_utils.PATCH, "/comments/ ", VALID_POST_EDIT_COMMENT_BODY())

		router.ServeHTTP(responseRecorder, request)

		responseBody := getResponseBody(*responseRecorder)
		commentErrorResponseBody := responseBody.(map[string]interface{})

		invalidPayloadErr := buildCommentsError(InvalidPayload, nil)
		assert.EqualValues(t, invalidPayloadErr.Error(), commentErrorResponseBody["Key"])
	})

	t.Run("should return an InvalidPayloadError if text is an empty string in body", func(t *testing.T) {
		mockService := new(_MockCommentsService)
		router, responseRecorder := setupRouterAndReturnRecorder(mockService)

		request := http_utils.BuildRequest(http_utils.PATCH, "/comments/ ", map[string]interface{}{"text": ""})

		router.ServeHTTP(responseRecorder, request)

		responseBody := getResponseBody(*responseRecorder)
		commentErrorResponseBody := responseBody.(map[string]interface{})

		invalidPayloadErr := buildCommentsError(InvalidPayload, nil)
		assert.EqualValues(t, invalidPayloadErr.Error(), commentErrorResponseBody["Key"])
	})
}

func buildPostCommentRequest(body map[string]interface{}) *http.Request {
	return http_utils.BuildRequest(http_utils.POST, "/comments", body)
}

func buildGetCommentsRequest(taskID string) *http.Request {
	return http_utils.BuildRequest(http_utils.GET, fmt.Sprintf("/%s/comments", taskID), nil)
}

func VALID_POST_EDIT_COMMENT_BODY() map[string]interface{} {
	return map[string]interface{}{"text": "my test"}
}

func INVALID_POST_EDIT_COMMENT_BODY() map[string]interface{} {
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

func setupRouterAndReturnRecorder(mockService *_MockCommentsService) (*gin.Engine, *httptest.ResponseRecorder) {
	responseRecorder := httptest.NewRecorder()

	router := gin.Default()
	controller := TaskCommentsController{
		service: mockService,
	}
	router.POST("/comments", controller.postComment)
	router.GET("/:taskID/comments", controller.getTaskComments)
	router.PATCH("/comments/:commentID", controller.updateComment)

	return router, responseRecorder
}

func getResponseBody(responseRecorder httptest.ResponseRecorder) interface{} {
	responseBody := responseRecorder.Result().Body
	var response interface{}

	json.NewDecoder(responseBody).Decode(&response)

	return response
}
