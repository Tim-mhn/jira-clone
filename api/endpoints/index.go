package endpoints

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/invitations"
	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/search"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	task_comments "github.com/tim-mhn/figma-clone/modules/task-comments"
	task_type "github.com/tim-mhn/figma-clone/modules/task-type"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"

	"github.com/tim-mhn/figma-clone/modules/tasks"
)

func RegisterAllEndpoints(router *gin.Engine, conn *sql.DB) {
	auth.RegisterEndpoints(router, conn)

	projectRoutes := project.RegisterEndpoints(router, conn)
	invitations.RegisterEndpoints(conn, projectRoutes)
	search.RegisterEndpoints(router, conn)
	sprints.RegisterEndpoints(projectRoutes.SingleProjectRoutes, conn)
	singleTaskRoutes := tasks.RegisterEndpoints(projectRoutes.SingleProjectRoutes, conn)
	task_type.RegisterEndpoints(projectRoutes.SingleProjectRoutes, conn)
	task_comments.RegisterEndpoints(singleTaskRoutes, conn)
	tags.RegisterEndpoints(projectRoutes.SingleProjectRoutes, conn)

}
