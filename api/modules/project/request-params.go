package project

import "github.com/gin-gonic/gin"

const PROJECT_ID_ROUTE_PARAM string = "projectID"

func GetProjectIDParam(c *gin.Context) string {
	return c.Param(PROJECT_ID_ROUTE_PARAM)
}
