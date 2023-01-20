package invitations

type InvitationEmailInfo struct {
	Recipient   EmailRecipient
	Token       InvitationToken
	ProjectName string
}

type InvitationEmailInfoList []InvitationEmailInfo
