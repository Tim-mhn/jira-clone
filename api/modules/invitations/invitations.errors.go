package invitations

import (
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
)

type InvitationErrorCode int

const (
	InvitationTokenNotFound InvitationErrorCode = iota
	InvitationEmailMismatch
	InvitationExpired
	InvitationAlreadyUsed
	InvitationValid
	OtherInvitationError
)

type InvitationError = shared_errors.DomainError[InvitationErrorCode]

func (err InvitationErrorCode) String() string {
	switch err {
	case InvitationTokenNotFound:
		return "InvitationTokenNotFound"

	case InvitationEmailMismatch:
		return "InvitationEmailMismatch"

	case InvitationExpired:
		return "InvitationExpired"

	case InvitationAlreadyUsed:
		return "InvitationAlreadyUsed"

	case InvitationValid:
		return "InvitationValid"

	case OtherInvitationError:
		return shared_errors.UnexpectedErrorCode()
	}

	return shared_errors.UnexpectedErrorCode()

}

func (err InvitationErrorCode) UserFriendlyString() string {
	switch err {
	case InvitationTokenNotFound:
		return "Token is invalid"

	case InvitationEmailMismatch:
		return "Invitation has not been send to this email"

	case InvitationExpired:
		return "Invitation has expired"

	case InvitationAlreadyUsed:
		return "Invitation has already been used."

	case InvitationValid:
		return ""

	case OtherInvitationError:
		return shared_errors.UnexpectedErrorMessage()
	}

	return shared_errors.UnexpectedErrorMessage()
}

func NoInvitationsError() InvitationError {
	return shared_errors.NoError[InvitationErrorCode]()
}

func buildInvitationsError(code InvitationErrorCode, source error) InvitationError {
	return shared_errors.BuildError(code, source)
}
