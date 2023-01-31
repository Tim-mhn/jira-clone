package http_utils

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func BuildRequest(method string, url string, body map[string]interface{}) *http.Request {
	m, b := body, new(bytes.Buffer)
	json.NewEncoder(b).Encode(m)
	req, _ := http.NewRequest(method, url, b)

	return req
}

func ReturnJsonAndAbort(c *gin.Context, code int, data interface{}) {
	c.IndentedJSON(code, data)
	c.Abort()
}
