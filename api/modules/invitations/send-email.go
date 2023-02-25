package invitations

import (
	"github.com/mailjet/mailjet-apiv3-go/v4"
	"github.com/tim-mhn/figma-clone/environments"
)

func SendEmail(email Email) error {
	client := initClient()
	emailInfo := buildEmailInformation(email)
	mailjetEmail := mailjet.MessagesV31{Info: emailInfo}
	_, err := client.SendMailV31(&mailjetEmail)
	return err

}

func initClient() *mailjet.Client {
	API_KEY := environments.GetConfig().Mailjet.ApiKey
	SECRET_KEY := environments.GetConfig().Mailjet.SecretKey
	mailjetClient := mailjet.NewMailjetClient(API_KEY, SECRET_KEY)
	return mailjetClient

}

func buildEmailInformation(email Email) []mailjet.InfoMessagesV31 {
	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: environments.GetConfig().Mailjet.Sender.Email,
				Name:  environments.GetConfig().Mailjet.Sender.Name,
			},
			To: &mailjet.RecipientsV31{
				mailjet.RecipientV31{
					Email: email.Recipient.Email,
					Name:  email.Recipient.Name,
				},
			},
			Subject: email.Subject,
			// TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
			HTMLPart: email.Content,
		},
	}

	return messagesInfo
}
