package sprints

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/project"
)

func RegisterEndpoints(singleProjectRoutes project.SingleProjectRoutes, conn *sql.DB) {

	repo := NewSprintRepository(conn)

	pointsRepo := NewSprintPointsRepository(conn)
	service := NewSprintService(repo, *pointsRepo)

	controller := NewSprintsController(repo, *service)

	sprintsRoutes := singleProjectRoutes.Group("/sprints")
	sprintsRoutes.GET("", controller.GetActiveSprintsOfProject)
	sprintsRoutes.POST("", controller.CreateSprint)

	singleSprintRoutes := sprintsRoutes.Group("/:sprintID")
	singleSprintRoutes.DELETE("", controller.DeleteSprint)
	singleSprintRoutes.PATCH("", controller.UpdateSprint)
	singleSprintRoutes.GET("", controller.GetSprintInfo)
	singleSprintRoutes.POST("/complete", controller.UpdateSprintCompletedStatus)

}
