package controllers

import "github.com/gin-gonic/gin"

const TASK_ID_ROUTE_PARAM string = "taskID"
const PROJECT_ID_ROUTE_PARAM string = "projectID"

func getProjectIDParam(c *gin.Context) string {
	return c.Param(PROJECT_ID_ROUTE_PARAM)
}

func getTaskIDParam(c *gin.Context) string {
	return c.Param(TASK_ID_ROUTE_PARAM)
}
