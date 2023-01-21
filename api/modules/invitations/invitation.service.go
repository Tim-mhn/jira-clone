package invitations

import (
	"fmt"
	"sync"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type ProjectInvitationService struct {
	repo        *ProjectInvitationRepository
	projectRepo *project.ProjectRepository
	userService *auth.UserService
}

func NewProjectInvitationService(repo *ProjectInvitationRepository, projectRepo *project.ProjectRepository, userService *auth.UserService) *ProjectInvitationService {
	return &ProjectInvitationService{
		repo:        repo,
		projectRepo: projectRepo,
		userService: userService,
	}
}

func (service *ProjectInvitationService) CreateProjectInvitationsAndSendEmails(input ProjectInvitationsInput) error {

	projectName, invitationTokens, err := service.getProjectNameAndCreateInvitationsInParallel(input)

	if err != nil {
		return err
	}

	emailInfoList, err := buildInvitationEmailInfoList(projectName, invitationTokens, input.guestEmails)

	if err != nil {
		return err
	}

	mailingError := SendProjectInvitationEmails(emailInfoList)

	return mailingError

}

func (service *ProjectInvitationService) getProjectNameAndCreateInvitationsInParallel(input ProjectInvitationsInput) (string, InvitationTokens, error) {
	projectNameChan := make(chan string, 1)
	tokensChan := make(chan InvitationTokens, 1)
	var wg sync.WaitGroup

	var errorList []error
	wg.Add(2)

	go func() {
		project, err := service.projectRepo.GetProjectByID(input.projectID)
		if err != nil {
			errorList = append(errorList, err)
		}
		projectNameChan <- project.Name
		wg.Done()
	}()

	go func() {
		invitationTokens, err := service.repo.CreateProjectInvitations(input)
		if err != nil {
			errorList = append(errorList, err)

		}
		tokensChan <- invitationTokens
		wg.Done()
	}()

	invitationTokens := <-tokensChan
	projectName := <-projectNameChan
	wg.Wait()

	hasError := len(errorList) > 0
	if hasError {
		return "", invitationTokens, errorList[0]
	}

	return projectName, invitationTokens, nil
}

func buildInvitationEmailInfoList(projectName string, tokens InvitationTokens, guestEmails []string) (InvitationEmailInfoList, error) {

	if len(tokens) != len(guestEmails) {
		return InvitationEmailInfoList{}, fmt.Errorf("tokens and guestEmails should have the same length")
	}

	var index = 0
	infoList := arrays.MapArray(tokens, func(token InvitationToken) InvitationEmailInfo {
		emailInfo := InvitationEmailInfo{
			Token: token,
			Recipient: EmailRecipient{
				Email: guestEmails[index],
				Name:  "random",
			},
			ProjectName: projectName,
		}

		index += 1

		return emailInfo
	})

	return infoList, nil
}

func (service *ProjectInvitationService) AcceptProjectInvitation(invitationTicket InvitationTicket) (AcceptInvitationOutput, InvitationError) {
	invitation, invitationError := service.repo.CheckInvitationIsValid(invitationTicket)

	if !invitationError.NoError {
		return AcceptInvitationOutput{}, invitationError
	}

	service.repo.MarkInvitationAsUsed(invitation.ID)

	user, _, err := service.userService.GetUserFromEmail(invitationTicket.Email)

	if err != nil {
		return AcceptInvitationOutput{}, InvitationError{
			Source: err,
			Code:   OtherInvitationError,
		}
	}
	err = service.projectRepo.AddMemberToProject(invitation.ProjectID, user.Id)

	if err != nil {
		return AcceptInvitationOutput{}, InvitationError{
			Source: err,
			Code:   OtherInvitationError,
		}
	}
	return AcceptInvitationOutput{
			ProjectId: invitation.ProjectID,
		}, InvitationError{
			NoError: true,
		}

}
