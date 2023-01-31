package task_comments

import (
	"bytes"
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
)

type mockCommentsRepository struct {
	mock.Mock
}

func (mockRepo mockCommentsRepository) createComment(createComment CreateCommentInput) CommentsError {
	args := mockRepo.Called()
	return args.Get(0).(CommentsError)
}

func (mockRepo mockCommentsRepository) getTaskComments(taskID string) (TaskComments, CommentsError) {
	return TaskComments{}, NO_COMMENTS_ERROR()
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

			mockRepo.Mock.On("createComment").Return(testData["repoResponse"])

			req := buildRequest(testData["requestBody"].(map[string]interface{}))
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

		request := buildRequest(INVALID_REQUEST_BODY())

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

		request := buildRequest(VALID_REQUEST_BODY())

		router.ServeHTTP(responseRecorder, request)

		responseBody := getResponseBody(*responseRecorder).(map[string]interface{})

		wrongField, err := typeOfResponseIsAPIResponse(responseBody)

		if err != nil {
			assert.NotNil(t, responseBody[wrongField], fmt.Sprintf(`apiResponse should have a %s field`, wrongField))

		}

	})

}

func VALID_REQUEST_BODY() map[string]interface{} {
	return map[string]interface{}{"text": "my test"}
}

func INVALID_REQUEST_BODY() map[string]interface{} {
	return map[string]interface{}{"wrong-property": "my test"}

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

func setupRouterAndReturnRecorder(mockRepo TaskCommentsRepository) (*gin.Engine, *httptest.ResponseRecorder) {
	responseRecorder := httptest.NewRecorder()

	router := gin.Default()
	controller := TaskCommentsController{
		repo: mockRepo,
	}
	router.POST("/comments", controller.postComment)

	return router, responseRecorder
}

func buildRequest(body map[string]interface{}) *http.Request {
	m, b := body, new(bytes.Buffer)
	json.NewEncoder(b).Encode(m)
	req, _ := http.NewRequest("POST", "/comments", b)

	return req
}

func getResponseBody(responseRecorder httptest.ResponseRecorder) interface{} {
	responseBody := responseRecorder.Result().Body
	var response interface{}

	json.NewDecoder(responseBody).Decode(&response)

	return response
}
