package invitations

type InvitationToken string
type InvitationTokens []InvitationToken

type ProjectInvitationsInput struct {
	projectID   string
	guestEmails []string
}
type InvitationTicket struct {
	Email string
	Token InvitationToken
}

type ProjectInvitation struct {
	ID, ProjectID, GuestEmail, Token string
	Used, Expired                    bool
}

type AcceptInvitationOutput struct {
	ProjectId string
}
