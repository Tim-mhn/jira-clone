package http_utils

import (
	"net/http"
)

func NewMockHTTPResponse() *http.Response {
	res := new(http.Response)

	res.Status = http.StatusText(http.StatusOK)
	res.StatusCode = http.StatusOK
	res.Body = http.NoBody

	return res

}
