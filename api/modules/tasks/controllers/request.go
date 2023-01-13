package tasks_controllers

import "github.com/gin-gonic/gin"

const TASK_ID_ROUTE_PARAM string = "taskID"

func getTaskIDParam(c *gin.Context) string {
	return c.Param(TASK_ID_ROUTE_PARAM)
}
