package endpoints

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/invitations"
	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/search"
	task_type "github.com/tim-mhn/figma-clone/modules/task-type"
	"github.com/tim-mhn/figma-clone/modules/tasks"
)

func RegisterAllEndpoints(router *gin.Engine, conn *sql.DB) {
	auth.RegisterAuthEndpoints(router, conn)

	projectRoutes := project.RegisterProjectsEndpoints(router, conn)
	tasks.RegisterTasksEndpoints(projectRoutes.SingleProjectRoutes, conn)
	task_type.RegisterTaskTypesEndpoints(projectRoutes.SingleProjectRoutes, conn)
	invitations.RegisterInvitationsEndpoints(conn, projectRoutes)
	search.RegisterSearchEndpoint(router, conn)

}
