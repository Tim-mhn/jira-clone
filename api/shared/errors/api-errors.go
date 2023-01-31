package shared_errors

type APIErrorResponse struct {
	Key     string
	Message string
	Details string
}

func UNPROCESSABLE_ENTITY_API_ERROR_RESPONSE() APIErrorResponse {
	return APIErrorResponse{
		Key:     "unprocessable-entity",
		Message: "An error occurred. Input is invalid",
	}
}

func BuildAPIErrorFromDomainError[T DomainErrorCode](domainErrorResponse DomainError[T]) APIErrorResponse {
	errorKey := domainErrorResponse.Code.String()
	errorMessage := domainErrorResponse.Code.UserFriendlyString()
	return APIErrorResponse{
		Key:     errorKey,
		Message: errorMessage,
		Details: domainErrorResponse.Error(),
	}
}
