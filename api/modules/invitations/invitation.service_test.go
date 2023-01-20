package invitations

import (
	"testing"
)

func TestBuildInvitationEmailInfoList(t *testing.T) {

	const PROJECT_NAME = "Project Name Test"
	t.Run("it should throw an error if tokens and guestEmails don't have the same length", func(t *testing.T) {
		tokens := InvitationTokens{"a", "b", "c"}

		guestEmails := []string{"email1@email.com", "email2@email.com"}

		_, err := buildInvitationEmailInfoList(PROJECT_NAME, tokens, guestEmails)

		if err == nil {
			t.Fatalf("should have thrown an error")
		}
	})

	t.Run("it should return a list with as many items as tokens & guestEmails", func(t *testing.T) {
		tokens := InvitationTokens{"a", "b", "c"}

		guestEmails := []string{"email1@email.com", "email2@email.com", "email3@email.com"}

		emailInfoList, _ := buildInvitationEmailInfoList(PROJECT_NAME, tokens, guestEmails)

		testPassed := len(emailInfoList) == len(tokens)

		if !testPassed {
			t.Fatalf("error in items returned. Expected %d emailInfo. Got %d", len(emailInfoList), len(tokens))
		}

	})

	t.Run("it successfuly attach the correct email and token for each emailInfo", func(t *testing.T) {
		tokens := InvitationTokens{"a", "b", "c"}

		guestEmails := []string{"email1@email.com", "email2@email.com", "email3@email.com"}

		emailInfoList, _ := buildInvitationEmailInfoList(PROJECT_NAME, tokens, guestEmails)

		for index, emailInfo := range emailInfoList {
			expectedEmail := emailInfo.Recipient.Email
			expectedToken := emailInfo.Token
			emailIsCorrect := expectedEmail == guestEmails[index]
			tokenIsCorrect := expectedToken == tokens[index]

			if !emailIsCorrect {
				t.Fatalf("Error in email. Expected %s. Got %s ", expectedEmail, guestEmails[index])
			}
			if !tokenIsCorrect {
				t.Fatalf("Error in token. Expected %s. Got %s ", expectedToken, string(tokens[index]))
			}

		}

	})

	t.Run("it should attach the projectName to every emailInfo in the list", func(t *testing.T) {
		tokens := InvitationTokens{"a", "b", "c"}

		guestEmails := []string{"email1@email.com", "email2@email.com", "email3@email.com"}

		emailInfoList, _ := buildInvitationEmailInfoList(PROJECT_NAME, tokens, guestEmails)

		expectedProjectName := PROJECT_NAME
		for _, emailInfo := range emailInfoList {

			projectName := emailInfo.ProjectName

			if projectName != expectedProjectName {
				t.Fatalf("Incorrect projectId in emailInfo. Expected %s. Got %s ", expectedProjectName, projectName)
			}

		}

	})

}
