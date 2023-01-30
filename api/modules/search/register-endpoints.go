package search

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

func RegisterEndpoints(router *gin.Engine, conn *sql.DB) {

	repo := NewSearchTasksRepository(conn)
	controller := NewSearchController(repo)

	router.GET("/search", auth.IsAuthenticatedMiddleware(), controller.SearchTasksWithMatchingContentInUserProjects)
}
