package project

type ProjectInvitationInput struct {
	guestEmail string
	projectID  string
}

type ProjectInvitationCheck struct {
	guestEmail string
	token      string
}

type ProjectInvitation struct {
	id         string
	guestEmail string
	token      string
	used       bool
	expired    bool
}

type AcceptInvitationOutput struct {
	NoUserWithEmail bool
}
