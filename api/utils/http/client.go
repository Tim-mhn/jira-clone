package http_utils

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func PostJSON(url string, body interface{}) (*http.Response, error) {
	jsonBody, _ := json.Marshal(body)
	return http.Post(url, "application/json", bytes.NewBuffer(jsonBody))
}
