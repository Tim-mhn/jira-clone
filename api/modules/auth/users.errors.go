package auth

import shared_errors "github.com/tim-mhn/figma-clone/shared/errors"

type UsersErrorCode int

const (
	UserNotFound UsersErrorCode = iota
	InvalidCredentials
	OtherUserError
)

func (code UsersErrorCode) String() string {
	switch code {

	case UserNotFound:
		return "NoUserError"

	case InvalidCredentials:
		return "InvalidCredentials"

	}

	return shared_errors.UnexpectedErrorCode()
}

func (code UsersErrorCode) UserFriendlyString() string {
	switch code {

	case UserNotFound:
		return "User not found"

	case InvalidCredentials:
		return "Invalid credentials"

	}

	return shared_errors.UnexpectedErrorMessage()
}

type UsersError = shared_errors.DomainError[UsersErrorCode]

func NoUsersError() UsersError {
	return shared_errors.NoError[UsersErrorCode]()
}
