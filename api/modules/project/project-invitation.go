package project

type ProjectInvitationInput struct {
	guestEmail, projectID string
}

type ProjectInvitationCheck struct {
	guestEmail string
	token      string
}

type ProjectInvitation struct {
	id, projectID, guestEmail, token string
	used, expired                    bool
}

type AcceptInvitationOutput struct {
	ProjectId string
}
