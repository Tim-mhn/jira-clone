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

func (service *ProjectInvitationService) acceptInvitationIfGuestWithEmailExists(projectID string, invitation ProjectInvitationCheck) (AcceptInvitationOutput, error) {

	invitationID, invitationCheck := service.repo.CheckInvitationIsValid(invitation)

	if invitationCheck != InvitationValid {
		return AcceptInvitationOutput{}, fmt.Errorf("error invitation not valid %d", invitationCheck)
	}

	service.repo.MarkInvitationAsUsed(invitationID)

	user, userError, _ := service.userService.GetUserFromEmail(invitation.guestEmail)

	if userError == auth.UserNotFound {
		return AcceptInvitationOutput{
			NoUserWithEmail: true,
		}, nil
	}

	err := service.projectRepo.AddMemberToProject(projectID, user.Id)
	return AcceptInvitationOutput{}, err
	// err := repo.checkInvitationIsValid()
	/*
		if err return

		repo.markInvitationAsUsed()

		userId = getIdFromEmail
		projectRepo.addUserToProject(projectId, userId)
	*/
}
