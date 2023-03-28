package sprints

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

type TestUser struct {
	Age       int    `validate:"gte=5"`
	Role      string `validate:"role_guest_admin"`
	FirstName string
	LastName  string
}

func TestControllerUpdateSprint(t *testing.T) {

	t.Run("it should return a BadRequestError if all fields of UpdateSprintDTO are missing", func(t *testing.T) {

		controller := new(SprintsController)
		responseRecorder := httptest.NewRecorder()
		router := gin.Default()

		router.PATCH("/sprints", controller.UpdateSprint)

		request := http_utils.BuildRequest(http_utils.PATCH, "/sprints", map[string]interface{}{})

		router.ServeHTTP(responseRecorder, request)

		result := responseRecorder.Result()
		statusCode := result.StatusCode
		responseBody := result.Body
		var response shared_errors.APIErrorResponse

		err := json.NewDecoder(responseBody).Decode(&response)

		assert.Nil(t, err, "error when decoding response body")

		assert.Equal(t, http.StatusBadRequest, statusCode)
		assert.Contains(t, response.Details, "Should have at least StartDate, EndDate or Name")

	})
}
