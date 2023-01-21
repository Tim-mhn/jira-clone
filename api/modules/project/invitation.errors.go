package project

type InvitationErrorCode int

const (
	InvitationTokenNotFound InvitationErrorCode = iota
	InvitationEmailMismatch
	InvitationExpired
	InvitationAlreadyUsed
	InvitationValid
)
