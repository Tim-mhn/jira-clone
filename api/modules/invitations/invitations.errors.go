package invitations

type ProjectInvitationError int

const (
	InvitationTokenNotFound ProjectInvitationError = iota
	InvitationEmailMismatch
	InvitationExpired
	InvitationAlreadyUsed
	InvitationValid
	OtherInvitationError
)
