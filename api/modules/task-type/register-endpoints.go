package task_type

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

func RegisterEndpoints(singleProjectRoutes *gin.RouterGroup, conn *sql.DB) {

	repo := NewTaskTypeRepository(conn)
	controller := NewTaskTypeController(repo)

	singleProjectRoutes.GET("/task-types", controller.GetTaskStatusList)

}
