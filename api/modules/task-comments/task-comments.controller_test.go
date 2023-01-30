package task_comments

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type mockCommentsRepository struct {
	mock.Mock
}

func (mockRepo mockCommentsRepository) createComment(createComment CreateCommentInput) CommentsError {
	args := mockRepo.Called()
	return args.Get(0).(CommentsError)
}

func TestPostCommentHttpCodes(t *testing.T) {

	gin.SetMode(gin.TestMode)

	testsData := []map[string]any{
		{
			"name":              "Should return 200 if the repo returns no error",
			"repoResponse":      NO_COMMENTS_ERROR(),
			"statusCode":        http.StatusOK,
			"requestBody":       map[string]interface{}{"text": "my test"},
			"checkResponseBody": false,
			"response":          nil,
		},
		{
			"name":              "should return BAD REQUEST if the repo returns a TaskNotFound error",
			"repoResponse":      buildCommentsError(TaskNotFound, fmt.Errorf("task not found")),
			"statusCode":        http.StatusBadRequest,
			"requestBody":       map[string]interface{}{"text": "my test"},
			"checkResponseBody": true,
			"response":          map[string]interface{}{"error": "Task not found"},
		},
		{
			"name":              "should return INTERNAL SERVER error if the repo returns an error",
			"repoResponse":      buildCommentsError(OtherCommentError, fmt.Errorf("some error")),
			"statusCode":        http.StatusInternalServerError,
			"checkResponseBody": false,

			"requestBody": map[string]interface{}{"text": "my test"},
		},
		{
			"name":              "should return BAD REQUEST error if the requestBody doesn't have text",
			"repoResponse":      NO_COMMENTS_ERROR(),
			"statusCode":        http.StatusBadRequest,
			"requestBody":       map[string]interface{}{"wrong-prop": "my test"},
			"checkResponseBody": false,
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
			expectedCode := testData["statusCode"]

			assert.Equal(t, expectedCode, code, fmt.Sprintf(`should return status code %d, got %d`, expectedCode, code))

		})

	}

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
