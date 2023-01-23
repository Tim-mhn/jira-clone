package tasks

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_controllers "github.com/tim-mhn/figma-clone/modules/tasks/controllers"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
)

func RegisterTasksEndpoints(singleProjectRoutes *gin.RouterGroup, conn *sql.DB) {
	userRepo := auth.NewUserRepository(conn)

	projectRepo := project.NewProjectCommandsRepository(userRepo, conn)
	taskStatusRepo := tasks_repositories.NewTaskStatusRepository(conn)
	sprintRepo := tasks_repositories.NewSprintRepository(conn)
	taskQueriesRepo := tasks_repositories.NewTaskQueriesRepository(userRepo, projectRepo, conn)

	tc := tasks_controllers.NewTasksController(userRepo, projectRepo, sprintRepo, taskQueriesRepo, conn)
	tsc := tasks_controllers.NewTaskStatusController(taskStatusRepo)
	sc := tasks_controllers.NewSprintsController(sprintRepo)

	taskStatusRoutes := singleProjectRoutes.Group("/task-status")
	taskStatusRoutes.GET("", tsc.GetTaskStatusList)

	tasksRoutes := singleProjectRoutes.Group("/tasks")
	tasksRoutes.POST("", tc.CreateNewTask)

	singleProjectRoutes.GET("/sprints", tc.GetSprintsWithTasksOfProject)
	singleProjectRoutes.POST("/sprints", sc.CreateSprint)
	singleProjectRoutes.DELETE("/sprints/:sprintID", sc.DeleteSprint)
	singleProjectRoutes.POST("/sprints/:sprintID/complete", sc.MarkSprintAsCompleted)

	singleTaskRoutes := tasksRoutes.Group(fmt.Sprintf(`/:%s`, tasks_controllers.TASK_ID_ROUTE_PARAM))
	singleTaskRoutes.GET("", tc.GetTaskByID)
	singleTaskRoutes.PATCH("", tc.UpdateTask)
	singleTaskRoutes.DELETE("", tc.DeleteTask)
	singleTaskRoutes.PATCH("/move", tc.MoveTask)

}
