package invitations

import (
	"fmt"
	"sync"
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
	return Email{
		Recipient: info.Recipient,
		Subject:   "[Tim Jira] Someone has invited you to join their project",
		Content: fmt.Sprintf(`<p>You have been invited to join the project <strong>%s</strong></p>`+
			`<p>Click on this button to accept the invitation and join the project<p>`+
			`<button><a href="http://localhost:4200/auth/sign-up/invite?token=%s">Join</a></button> `, info.ProjectName, info.Token),
	}
}
