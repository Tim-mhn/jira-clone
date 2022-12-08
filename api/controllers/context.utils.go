package controllers

import "github.com/gin-gonic/gin"

func getProjectIDFromContext(c *gin.Context) string {
	return c.Param(PROJECT_ID_ROUTE_PARAM)
}

func getTaskIDFromContext(c *gin.Context) string {
	return c.Param(TASK_ID_ROUTE_PARAM)
}
