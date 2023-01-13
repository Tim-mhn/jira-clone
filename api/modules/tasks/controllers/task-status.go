package tasks_controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
)

type taskStatusController struct {
	tsRepo *tasks_repositories.TaskStatusRepository
}

func NewTaskStatusController(tsRepo *tasks_repositories.TaskStatusRepository) *taskStatusController {
	return &taskStatusController{
		tsRepo: tsRepo,
	}
}

func (tsc *taskStatusController) GetTaskStatusList(c *gin.Context) {

	taskStatusList, err := tsc.tsRepo.GetAllStatus()

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, taskStatusList)
}
