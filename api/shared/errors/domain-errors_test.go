package shared_errors

import "testing"

func TestDomainError(t *testing.T) {

	t.Run("BuildError should set HasError=true ", func(t *testing.T) {
		domainError := BuildError(ERROR_1, nil)

		if !domainError.HasError {
			t.Fatalf("HasError should be true. Got %t", domainError.HasError)
		}
	})
}
