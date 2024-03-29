package shared_errors

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

type testDomainErrorCode int

type testDomainError = DomainError[testDomainErrorCode]

const (
	ERROR_1 testDomainErrorCode = iota + 1
	ERROR_2
)

func (error testDomainErrorCode) String() string {
	if error == ERROR_1 {
		return "error 1"
	}

	return "error 2"
}

func (error testDomainErrorCode) UserFriendlyString() string {
	if error == ERROR_1 {
		return "error 1 occurred"
	}

	return "error 2 occurred"
}

func TestBuildAPIErrorFromDomainError(t *testing.T) {

	t.Run("should correctly build APIError's Key and Message", func(t *testing.T) {

		domainError := testDomainError{
			Source: nil,
			Code:   ERROR_1,
		}
		apiError := BuildAPIErrorFromDomainError(domainError)

		expectedKey := "error 1"
		errorKey := apiError.Key

		expectedMessage := "error 1 occurred"
		errorMessage := apiError.Message

		if errorKey != expectedKey {
			t.Fatalf("Expected %s, got %s", expectedKey, errorKey)
		}

		if errorMessage !=
			expectedMessage {
			t.Fatalf("Expected %s, got %s",
				expectedMessage, errorMessage)
		}
	})

	t.Run("should correctly build APIError's Details", func(t *testing.T) {

		sourceError := fmt.Errorf("could not open file. invalid path")
		domainError := testDomainError{
			Source: sourceError,
			Code:   ERROR_1,
		}
		apiError := BuildAPIErrorFromDomainError(domainError)

		expectedErrorDetails := sourceError.Error()

		apiErrorDetails := apiError.Details

		assert.Equal(t, expectedErrorDetails, apiErrorDetails)

	})

}
