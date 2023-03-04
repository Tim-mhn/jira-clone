package http_utils

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type _TestStruct struct {
	Name string `json:"name"`
	Id   int    `json:"id"`
}

func TestBuildRequest(t *testing.T) {

	responseRecorder := httptest.NewRecorder()
	router := gin.Default()

	var dto _TestStruct

	mockEndpoint := func(c *gin.Context) {
		c.BindJSON(&dto)
		c.JSON(http.StatusOK, nil)
	}

	router.POST("/api", mockEndpoint)

	t.Run("it should correctly encode the struct into a json and pass it to the request body", func(t *testing.T) {
		body := _TestStruct{
			Name: "bob",
			Id:   1,
		}
		req := BuildRequest(POST, "/api", body)

		router.ServeHTTP(responseRecorder, req)

		assert.Equal(t, body, dto)

	})
}
