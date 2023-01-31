package shared_errors

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDomainError(t *testing.T) {

	t.Run("BuildError should set HasError=true ", func(t *testing.T) {
		domainError := BuildError(ERROR_1, nil)

		if !domainError.HasError {
			t.Fatalf("HasError should be true. Got %t", domainError.HasError)
		}
	})

	t.Run("should include error Details from source error", func(t *testing.T) {
		sourceError := fmt.Errorf("could not connect to database: invalid path")

		domainError := BuildError(ERROR_1, sourceError)

		expectedErrorDetails := sourceError.Error()

		errorDetails := domainError.Error()

		assert.Equal(t, expectedErrorDetails, errorDetails)
	})

	t.Run("should return Code.String() is source error is nil", func(t *testing.T) {
		domainError := BuildError(ERROR_1, nil)

		expectedErrorDetails := ERROR_1.String()

		errorDetails := domainError.Error()

		assert.Equal(t, expectedErrorDetails, errorDetails)
	})
}
