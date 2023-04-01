package tests_utils

func CastToErrorIfNotNil(errorOrNil interface{}) error {
	if errorOrNil != nil {
		return errorOrNil.(error)
	}

	return nil
}
