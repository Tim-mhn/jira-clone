package shared_errors

import (
	"fmt"
	"log"
)

type DomainErrorCode interface {
	String() string
	UserFriendlyString() string
}
type DomainError[T DomainErrorCode] struct {
	Source  error
	Code    T
	NoError bool
}

type ErrorBuilder struct {
	context string
}

// todo: to be removed once error handling has been harmonized and refactored
func (b ErrorBuilder) LogAndBuildError(functionName string, rootError error) error {
	contextualizedError := fmt.Errorf(`[%s.%s] Error in rows.scab %s`, b.context, functionName, rootError.Error())
	log.Print(contextualizedError.Error())
	return contextualizedError
}

func GetErrorBuilderForContext(context string) ErrorBuilder {
	return ErrorBuilder{
		context: context,
	}
}
