package tasks_controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
)

func buildAndReturnAPIError(c *gin.Context, err tasks_errors.TaskError) {
	apiErrorResponse := shared_errors.BuildAPIErrorFromDomainError(err)
	httpStatus := getCorrectHttpStatus(err)
	c.IndentedJSON(httpStatus, apiErrorResponse)
}

func getCorrectHttpStatus(err tasks_errors.TaskError) int {
	httpStatus := http.StatusUnprocessableEntity
	if err.Code == tasks_errors.TaskNotFound {
		httpStatus = http.StatusBadRequest
	}

	return httpStatus
}
