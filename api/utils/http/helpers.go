package http_utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func BuildRequest(method HTTPMethod, url string, body interface{}) *http.Request {
	buffer := EncodeJSON(body)

	methodString := httpMethodToString(method)

	req, err := http.NewRequest(methodString, url, buffer)
	if err != nil {
		fmt.Printf("[BuildRequest]: Error %e", err)
	}
	req.Header.Add("Content-Type", "application/json")
	return req
}

func EncodeJSON(body interface{}) *bytes.Buffer {
	m, buffer := body, new(bytes.Buffer)
	json.NewEncoder(buffer).Encode(m)
	return buffer
}
