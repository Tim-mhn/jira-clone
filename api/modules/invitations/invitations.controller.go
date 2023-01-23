package invitations

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
)

type InvitationsController struct {
	service *ProjectInvitationService
}

func NewInvitationsController(repo *ProjectInvitationRepository, projectRepo *project.ProjectCommandsRepository, userRepo *auth.UserRepository) *InvitationsController {
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
		apiErrorResponse := shared_errors.UNPROCESSABLE_ENTITY_API_ERROR_RESPONSE()
		c.IndentedJSON(http.StatusUnprocessableEntity, apiErrorResponse)
		return
	}

	output, err := controller.service.AcceptProjectInvitation(InvitationTicket(acceptInvitationDTO))

	if err.HasError {
		apiErrorResponse := shared_errors.BuildAPIErrorFromDomainError(err)
		c.IndentedJSON(http.StatusInternalServerError, apiErrorResponse)
		return
	}

	c.IndentedJSON(http.StatusOK, output)

}
