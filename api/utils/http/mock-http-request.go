package http_utils

import (
	"github.com/gin-gonic/gin"
)

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
