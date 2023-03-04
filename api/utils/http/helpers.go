package http_utils

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func BuildRequest(method string, url string, body map[string]interface{}) *http.Request {
	m, b := body, new(bytes.Buffer)
	json.NewEncoder(b).Encode(m)
	req, _ := http.NewRequest(method, url, b)

	return req
}

func PostJSON(url string, body interface{}) (*http.Response, error) {
	buffer, _ := BufferJSON(body)

	return http.Post(url, "application/json", buffer)
}

func BufferJSON(body interface{}) (*bytes.Buffer, error) {
	jsonBody, err := json.Marshal(body)

	if err != nil {
		return new(bytes.Buffer), err
	}

	return bytes.NewBuffer(jsonBody), nil

}
