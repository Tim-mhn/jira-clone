package tasks

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_controllers "github.com/tim-mhn/figma-clone/modules/tasks/controllers"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
)

type SingleTaskRoutes = *gin.RouterGroup

func RegisterEndpoints(singleProjectRoutes project.SingleProjectRoutes, conn *sql.DB) SingleTaskRoutes {

	tasksController, taskStatusController, sprintsController := buildControllers(conn)
	taskStatusRoutes := singleProjectRoutes.Group("/task-status")
	taskStatusRoutes.GET("", taskStatusController.GetTaskStatusList)

	tasksRoutes := singleProjectRoutes.Group("/tasks")
	tasksRoutes.POST("", tasksController.CreateNewTask)

	singleProjectRoutes.GET("/tasks", tasksController.GetSprintsWithTasksOfProject)
	singleProjectRoutes.GET("/sprints", sprintsController.GetActiveSprintsOfProject)
	singleProjectRoutes.POST("/sprints", sprintsController.CreateSprint)
	singleProjectRoutes.DELETE("/sprints/:sprintID", sprintsController.DeleteSprint)
	singleProjectRoutes.PATCH("/sprints/:sprintID", sprintsController.UpdateSprint)
	singleProjectRoutes.POST("/sprints/:sprintID/complete", sprintsController.MarkSprintAsCompleted)

	singleTaskRoutes := tasksRoutes.Group(fmt.Sprintf(`/:%s`, tasks_controllers.TASK_ID_ROUTE_PARAM))
	singleTaskRoutes.GET("", tasksController.GetTaskByID)
	singleTaskRoutes.PATCH("", tasksController.UpdateTask)
	singleTaskRoutes.DELETE("", tasksController.DeleteTask)
	singleTaskRoutes.PATCH("/move", tasksController.MoveTask)

	return singleTaskRoutes

}

func buildControllers(conn *sql.DB) (*tasks_controllers.TasksController, *tasks_controllers.TaskStatusController, *tasks_controllers.SprintsController) {
	userRepo := auth.NewUserRepository(conn)

	projectQueriesRepo := project.NewProjectQueriesRepository(conn)
	taskStatusRepo := tasks_repositories.NewTaskStatusRepository(conn)
	sprintRepo := tasks_repositories.NewSprintRepository(conn)
	sprintPointsRepo := tasks_repositories.NewSprintPointsRepository(conn)
	taskQueriesRepo := tasks_repositories.NewTaskQueriesRepository(userRepo, conn)
	sprintService := tasks_services.NewSprintService(taskQueriesRepo, sprintRepo, sprintPointsRepo)

	// todo: build endpoint to get list of /active-sprints of project
	tasksController := tasks_controllers.NewTasksController(userRepo, projectQueriesRepo, sprintRepo, taskQueriesRepo, conn)
	taskStatusController := tasks_controllers.NewTaskStatusController(taskStatusRepo)
	sprintsController := tasks_controllers.NewSprintsController(sprintRepo, *sprintService)

	return tasksController, taskStatusController, sprintsController

}
