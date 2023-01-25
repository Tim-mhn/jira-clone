package tasks_errors

import shared_errors "github.com/tim-mhn/figma-clone/shared/errors"

type TaskErrorCode int

const (
	TaskNotFound TaskErrorCode = iota
	OtherTaskError
)

type TaskError = shared_errors.DomainError[TaskErrorCode]

func (err TaskErrorCode) String() string {
	switch err {
	case TaskNotFound:
		return "TaskNotFound"

	case OtherTaskError:
		return "OtherTaskError"
	}

	return "OtherTaskError"

}

func (err TaskErrorCode) UserFriendlyString() string {
	switch err {
	case TaskNotFound:
		return "Could not find the task"

	case OtherTaskError:
		return shared_errors.UnexpectedErrorMessage()
	}

	return shared_errors.UnexpectedErrorMessage()
}

func NoTaskError() TaskError {
	return shared_errors.NoError[TaskErrorCode]()
}

func BuildTaskError(code TaskErrorCode, source error) TaskError {
	return shared_errors.BuildError(code, source)
}
