package http_utils

import (
	"net/http"

	"github.com/stretchr/testify/mock"
)

type MockHTTPClient struct {
	mock.Mock
}

func (mockClient *MockHTTPClient) Do(req *http.Request) (*http.Response, error) {
	args := mockClient.Called(mock.Anything)
	return args.Get(0).(*http.Response), nil
}
