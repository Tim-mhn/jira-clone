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

type HTTPMethod int

const (
	POST HTTPMethod = iota
	GET
	PUT
	DELETE
	PATCH
)

func SetupMockRouterAndRegisterEndpoint(method HTTPMethod, endpoint string, handler gin.HandlerFunc) *gin.Engine {
	router := gin.Default()
	registerHandlerFn := getRegisterHandlerFn(method)
	registerHandlerFn(router, endpoint, handler)
	return router

}

type _RegisterHandlerFn = func(router *gin.Engine, endpoint string, handler gin.HandlerFunc)

func getRegisterHandlerFn(method HTTPMethod) _RegisterHandlerFn {

	if method == POST {
		var fn _RegisterHandlerFn = func(router *gin.Engine, endpoint string, handler gin.HandlerFunc) {
			router.POST(endpoint, handler)
		}

		return fn
	}

	if method == GET {
		var fn _RegisterHandlerFn = func(router *gin.Engine, endpoint string, handler gin.HandlerFunc) {
			router.GET(endpoint, handler)
		}

		return fn
	}

	if method == PATCH {
		var fn _RegisterHandlerFn = func(router *gin.Engine, endpoint string, handler gin.HandlerFunc) {
			router.PATCH(endpoint, handler)
		}

		return fn
	}

	if method == DELETE {
		var fn _RegisterHandlerFn = func(router *gin.Engine, endpoint string, handler gin.HandlerFunc) {
			router.DELETE(endpoint, handler)
		}

		return fn
	}

	return nil
}
