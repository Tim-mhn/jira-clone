package shared

import (
	"fmt"
	"log"
)

type ErrorBuilder struct {
	context string
}

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
