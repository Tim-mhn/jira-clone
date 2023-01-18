package project

type ProjectInvitationError int

const (
	InvitationTokenNotFound ProjectInvitationError = iota
	InvitationEmailMismatch
	InvitationExpired
	InvitationAlreadyUsed
	InvitationValid
)

// type ProjectInvitationError struct {
// 	cause ProjectInvitationErrorCause
// }

// func (err ProjectInvitationError) Error() string {
// 	return fmt.Sprintf(`ProjectInvitationError caused by %d`, err.cause)
// }
