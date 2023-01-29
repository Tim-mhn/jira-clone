package task_type

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type TaskTypeController struct {
	repo *TaskTypeRepository
}

func NewTaskTypeController(repo *TaskTypeRepository) *TaskTypeController {
	return &TaskTypeController{
		repo: repo,
	}
}

func (tsc *TaskTypeController) GetTaskStatusList(c *gin.Context) {

	taskTypeList, err := tsc.repo.GetAllTaskTypes()

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, taskTypeList)
}
