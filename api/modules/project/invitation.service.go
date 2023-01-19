package project

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/modules/auth"
)

type ProjectInvitationService struct {
	repo        *ProjectInvitationRepository
	userService *auth.UserService
	projectRepo *ProjectRepository
}

func NewProjectInvitationService(repo *ProjectInvitationRepository, projectRepo *ProjectRepository, userService *auth.UserService) *ProjectInvitationService {
	return &ProjectInvitationService{
		repo:        repo,
		userService: userService,
		projectRepo: projectRepo,
	}
}

func (service *ProjectInvitationService) AcceptProjectInvitation(invitationCheck ProjectInvitationCheck) (AcceptInvitationOutput, error) {

	invitation, invitationError := service.repo.CheckInvitationIsValid(invitationCheck)

	if invitationError != InvitationValid {
		return AcceptInvitationOutput{}, fmt.Errorf("error invitation not valid %d", invitationError)
	}

	service.repo.MarkInvitationAsUsed(invitation.id)

	user, userError, _ := service.userService.GetUserFromEmail(invitationCheck.guestEmail)

	if userError == auth.UserNotFound {
		return AcceptInvitationOutput{}, fmt.Errorf("%d", userError)
	}

	err := service.projectRepo.AddMemberToProject(invitation.projectID, user.Id)
	return AcceptInvitationOutput{
		ProjectId: invitation.projectID,
	}, err

}
