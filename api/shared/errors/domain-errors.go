package shared_errors

import (
	"fmt"
	"log"
)

type DomainErrorCode interface {
	String() string
	UserFriendlyString() string
}

const ()

type DomainError[T DomainErrorCode] struct {
	Source   error
	Code     T
	HasError bool
}

func (err DomainError[T]) Error() string {
	if err.Source == nil {
		return err.Code.String()
	}

	return err.Source.Error()
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

func UnexpectedErrorCode() string {
	return "UnexpectedError"
}

func UnexpectedErrorMessage() string {
	return "An unexpected error has occurred"
}

func NoError[T DomainErrorCode]() DomainError[T] {
	return DomainError[T]{
		HasError: false,
	}
}

func BuildError[T DomainErrorCode](code T, source error) DomainError[T] {
	return DomainError[T]{
		Source:   source,
		Code:     code,
		HasError: source != nil,
	}
}
