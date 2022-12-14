package middlewares

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/repositories"
)

func CanAccessProjectMiddleware(pm *repositories.ProjectRepository) gin.HandlerFunc {
	return func(c *gin.Context) {

		projectID := c.Param("projectID")
		user, _ := GetUserFromRequestContext(c)

		memberIsInProject, err := pm.MemberIsInProject(projectID, user.Id)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}

		if !memberIsInProject {
			c.AbortWithStatusJSON(http.StatusForbidden, fmt.Errorf("member is not in project"))
			return
		}

		c.Next()
	}
}
