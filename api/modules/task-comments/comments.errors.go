package task_comments

import shared_errors "github.com/tim-mhn/figma-clone/shared/errors"

type CommentsErrorCode int

const (
	TaskNotFound = iota
	AuthorNotFound
	OtherCommentError
	InvalidPayload
)

type CommentsError = shared_errors.DomainError[CommentsErrorCode]

func (err CommentsErrorCode) String() string {
	switch err {

	case TaskNotFound:
		return "TaskNotFound"

	case AuthorNotFound:
		return "AuthorNotFound"

	case InvalidPayload:
		return "InvalidPayload"
	case OtherCommentError:

	}
	return shared_errors.UnexpectedErrorCode()

}

func (err CommentsErrorCode) UserFriendlyString() string {
	switch err {

	case TaskNotFound:
		return "Task not found"

	case AuthorNotFound:
		return "Author not found"

	case InvalidPayload:
		return "Invalid payload"

	case OtherCommentError:
	}

	return shared_errors.UnexpectedErrorMessage()
}

func buildCommentsError(code CommentsErrorCode, source error) CommentsError {
	return shared_errors.BuildError(code, source)
}
func NO_COMMENTS_ERROR() CommentsError {
	return shared_errors.NoError[CommentsErrorCode]()
}
