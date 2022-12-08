package controllers

import "github.com/gin-gonic/gin"

func getProjectIDParam(c *gin.Context) string {
	return c.Param(PROJECT_ID_ROUTE_PARAM)
}

func getTaskIDParam(c *gin.Context) string {
	return c.Param(TASK_ID_ROUTE_PARAM)
}
