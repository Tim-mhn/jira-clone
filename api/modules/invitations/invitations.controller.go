package invitations

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
)

type InvitationsController struct {
	service *ProjectInvitationService
}

func NewInvitationsController(repo *ProjectInvitationRepository, projectRepo *project.ProjectRepository, userRepo *auth.UserRepository) *InvitationsController {
	userService := auth.NewUserService(userRepo)

	return &InvitationsController{
		service: NewProjectInvitationService(repo, projectRepo, userService),
	}
}

func (controller *InvitationsController) InvitePeopleToProject(c *gin.Context) {
	projectID := project.GetProjectIDParam(c)

	var projectInvitationDTO SendInvitationsDTO
	if err := c.BindJSON(&projectInvitationDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	err := controller.service.CreateProjectInvitationsAndSendEmails(ProjectInvitationsInput{
		projectID:   projectID,
		guestEmails: projectInvitationDTO.GuestEmails,
	})

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

}

func (controller *InvitationsController) AcceptInvitation(c *gin.Context) {

	var acceptInvitationDTO AcceptInvitationDTO
	if err := c.BindJSON(&acceptInvitationDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	output, err := controller.service.AcceptProjectInvitation(InvitationTicket(acceptInvitationDTO))

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, output)

}
