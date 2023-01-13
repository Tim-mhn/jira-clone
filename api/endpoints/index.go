package endpoints

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/tasks"
)

func RegisterAllEndpoints(router *gin.Engine, conn *sql.DB) {

	projectRoutes := project.RegisterControllers(router, conn)
	tasks.RegisterControllers(projectRoutes.SingleProjectRoutes, conn)

	auth.RegisterUserControllers(router, conn)

}
