package auth

import shared_errors "github.com/tim-mhn/figma-clone/shared/errors"

type UsersErrorCode int

const (
	UserNotFound UsersErrorCode = iota
	UserEmailNotFound
	InvalidCredentials
	DuplicateEmail
	OtherUserError
)

func (code UsersErrorCode) String() string {
	switch code {

	case UserNotFound:
		return "NoUserError"

	case UserEmailNotFound:
		return "UserEmailNotFound"
	case InvalidCredentials:
		return "InvalidCredentials"

	case DuplicateEmail:
		return "DuplicateEmail"

	}

	return shared_errors.UnexpectedErrorCode()
}

func (code UsersErrorCode) UserFriendlyString() string {
	switch code {

	case UserNotFound:
		return "User not found"
	case UserEmailNotFound:
		return "No account with this email exists"
	case InvalidCredentials:
		return "Password is incorrect"
	case DuplicateEmail:
		return "This email has already been taken"
	}

	return shared_errors.UnexpectedErrorMessage()
}

type UsersError = shared_errors.DomainError[UsersErrorCode]

func NoUsersError() UsersError {
	return shared_errors.NoError[UsersErrorCode]()
}
