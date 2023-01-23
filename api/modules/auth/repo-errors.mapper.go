package auth

import (
	"github.com/lib/pq"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
)

func mapDBToDomainError(err error) UsersError {
	sqlError, ok := err.(*pq.Error)

	if !ok {
		return shared_errors.BuildError(OtherUserError, err)
	}

	if isDuplicateEmailError(*sqlError) {
		return shared_errors.BuildError(DuplicateEmail, err)
	}

	return shared_errors.BuildError(OtherUserError, err)

}

func isDuplicateEmailError(err pq.Error) bool {
	return err.Constraint == "user_email_key"
}
