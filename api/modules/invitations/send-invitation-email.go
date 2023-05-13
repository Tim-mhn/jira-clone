package invitations

import (
	"fmt"
	"sync"

	"github.com/tim-mhn/figma-clone/environments"
)

func SendProjectInvitationEmails(infoList InvitationEmailInfoList) error {
	var wg sync.WaitGroup
	wg.Add(len(infoList))

	var errorList []error
	for _, info := range infoList {
		go func(info InvitationEmailInfo) {
			email := buildEmailFromInvitationInfo(info)
			emailError := SendEmail(email)

			if emailError != nil {
				errorList = append(errorList, emailError)
			}

			wg.Done()

		}(info)

	}

	wg.Wait()

	if len(errorList) > 0 {
		return errorList[0]
	}

	return nil

}

func buildEmailFromInvitationInfo(info InvitationEmailInfo) Email {
	clientUrl := environments.GetConfig().ClientURL
	invitationUrl := fmt.Sprintf(`%s/auth/sign-up/invite?token=%s`, clientUrl, info.Token)
	return Email{
		Recipient: info.Recipient,
		Subject:   "[Tim Jira] Someone has invited you to join their project",
		Content: fmt.Sprintf(`<p>You have been invited to join the project <strong>%s</strong></p>`+
			`<p>Click on this button to accept the invitation and join the project<p>`+
			`<button><a href="%s">Join</a></button> `, info.ProjectName, invitationUrl),
	}
}
