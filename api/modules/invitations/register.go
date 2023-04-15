package invitations

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
)

func RegisterEndpoints(conn *sql.DB, projectRouterGroups project.ProjectRouterGroups) {
	controller := buildInvitationsController(conn)

	projectRouterGroups.ProjectsRoutes.POST("/members/invite/accept", controller.AcceptInvitation)
	projectRouterGroups.SingleProjectRoutes.POST("/members/invite", controller.InvitePeopleToProject)

}

func buildInvitationsController(conn *sql.DB) *InvitationsController {
	invitationsRepo := NewProjectInvitationRepository(conn)
	userRepo := auth.NewUserRepository(conn)
	projectRepo := project.NewProjectRepository(userRepo, conn)
	controller := NewInvitationsController(invitationsRepo, projectRepo, userRepo)
	return controller
}
