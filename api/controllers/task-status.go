package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/repositories"
)

type taskStatusController struct {
	tsRepo *repositories.TaskStatusRepository
}

func newTaskStatusController(tsRepo *repositories.TaskStatusRepository) *taskStatusController {
	return &taskStatusController{
		tsRepo: tsRepo,
	}
}

func (tsc *taskStatusController) getTaskStatusList(c *gin.Context) {

	taskStatusList, err := tsc.tsRepo.GetAllStatus()

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, taskStatusList)
}
