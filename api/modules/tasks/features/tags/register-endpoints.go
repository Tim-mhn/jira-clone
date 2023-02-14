package tags

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/project"
)

func RegisterEndpoints(singleProjectRoutes project.SingleProjectRoutes, conn *sql.DB) {

	service := NewTagsService(conn)
	controller := NewTagsController(service)

	tagsRoutes := singleProjectRoutes.Group("/tags")

	tagsRoutes.GET("", controller.GetTagsOfProject)
	tagsRoutes.POST("", controller.CreateTagForProject)
	tagsRoutes.GET("/template", controller.GetTaskTagTemplate)

}
