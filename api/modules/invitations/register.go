package invitations

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
)

func RegisterInvitationsEndpoints(conn *sql.DB, projectRouterGroups project.ProjectRouterGroups) {
	controller := buildInvitationsController(conn)

	projectRouterGroups.ProjectsRoutes.POST("/members/invite/accept", controller.AcceptInvitation)
	projectRouterGroups.SingleProjectRoutes.POST("/members/invite", controller.InvitePeopleToProject)

}

func buildInvitationsController(conn *sql.DB) *InvitationsController {
	invitationsRepo := NewProjectInvitationRepository(conn)
	userRepo := auth.NewUserRepository(conn)
	projectRepo := project.NewProjectCommandsRepository(userRepo, conn)
	controller := NewInvitationsController(invitationsRepo, projectRepo, userRepo)
	return controller
}
