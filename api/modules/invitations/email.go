package invitations

type EmailRecipient struct {
	Email, Name string
}

type Email struct {
	Recipient        EmailRecipient
	Subject, Content string
}
