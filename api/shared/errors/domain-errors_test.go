package shared_errors

import "testing"

func TestDomainError(t *testing.T) {

	t.Run("it should have NoError=false by default", func(t *testing.T) {
		domainError := testDomainError{
			Source: nil,
			Code:   ERROR_1,
		}

		if domainError.NoError {
			t.Fatalf("NoError should be false. Got %t", domainError.NoError)
		}
	})
}
