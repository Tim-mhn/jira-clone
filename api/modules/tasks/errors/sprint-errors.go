package tasks_errors

import shared_errors "github.com/tim-mhn/figma-clone/shared/errors"

type SprintErrorCode int

const (
	OtherSprintError SprintErrorCode = iota
	SprintNotFound
	UnauthorizedToChangeBacklogSprint
)

type SprintError = shared_errors.DomainError[SprintErrorCode]

func (err SprintErrorCode) String() string {
	switch err {
	case SprintNotFound:
		return "SprintNotFound"

	case OtherSprintError:
		return "OtherSprintError"

	case UnauthorizedToChangeBacklogSprint:
		return "UnauthorizedToChangeBacklogSprint"

	}

	return "OtherSprintError"

}

func (err SprintErrorCode) UserFriendlyString() string {
	switch err {
	case SprintNotFound:
		return "Could not find the sprint"

	case OtherSprintError:
		return shared_errors.UnexpectedErrorMessage()

	case UnauthorizedToChangeBacklogSprint:
		return "Unauthorized to change a backlog sprint"

	}

	return shared_errors.UnexpectedErrorMessage()
}

func NoSprintError() SprintError {
	return shared_errors.NoError[SprintErrorCode]()
}

func BuildSprintError(code SprintErrorCode, source error) SprintError {
	return shared_errors.BuildError(code, source)
}
