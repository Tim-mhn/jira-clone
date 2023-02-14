package tags

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/project"
)

func RegisterEndpoints(singleProjectRoutes project.SingleProjectRoutes, conn *sql.DB) {

	service := NewTagsService(conn)
	controller := NewTagsController(service)

	singleProjectRoutes.GET("/tags/template", controller.GetTaskTagTemplate)

}
