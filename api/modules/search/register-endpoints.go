package search

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

func RegisterEndpoints(router *gin.Engine, conn *sql.DB) {

	searchTasksRepo := NewSearchTasksRepository(conn)
	searchSprintsRepo := NewSearchSprintsRepository(conn)
	service := NewSearchService(searchTasksRepo, searchSprintsRepo)
	controller := NewSearchController(service)

	router.GET("/search", auth.IsAuthenticatedMiddleware(), controller.SearchTasksWithMatchingContentInUserProjects)
}
