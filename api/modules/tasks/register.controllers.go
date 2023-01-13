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

func RegisterControllers(singleProjectRoutes *gin.RouterGroup, conn *sql.DB) {
	userRepo := auth.NewUserRepository(conn)

	projectRepo := project.NewProjectRepository(userRepo, conn)
	taskStatusRepo := tasks_repositories.NewTaskStatusRepository(conn)
	sprintRepo := tasks_repositories.NewSprintRepository(conn)
	taskQueriesRepo := tasks_repositories.NewTaskQueriesRepository(userRepo, projectRepo, conn)

	tc := tasks_controllers.NewTasksController(userRepo, projectRepo, sprintRepo, taskQueriesRepo, conn)
	tsc := tasks_controllers.NewTaskStatusController(taskStatusRepo)

	taskStatusRoutes := singleProjectRoutes.Group("/task-status")
	taskStatusRoutes.GET("", tsc.GetTaskStatusList)

	tasksRoutes := singleProjectRoutes.Group("/tasks")
	tasksRoutes.POST("", tc.CreateNewTask)

	singleProjectRoutes.GET(`/sprints`, tc.GetSprintsWithTasksOfProject)

	singleTaskRoutes := tasksRoutes.Group(fmt.Sprintf(`/:%s`, tasks_controllers.TASK_ID_ROUTE_PARAM))
	singleTaskRoutes.GET("", tc.GetTaskByID)
	singleTaskRoutes.PATCH("", tc.UpdateTask)
	singleTaskRoutes.DELETE("", tc.DeleteTask)
	singleTaskRoutes.PATCH("/move", tc.MoveTask)

}
