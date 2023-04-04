package tasks

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	sprint_points "github.com/tim-mhn/figma-clone/modules/sprints/points"
	tasks_controllers "github.com/tim-mhn/figma-clone/modules/tasks/controllers"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/board"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_queries "github.com/tim-mhn/figma-clone/modules/tasks/queries"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
)

type SingleTaskRoutes = *gin.RouterGroup

func RegisterEndpoints(singleProjectRoutes project.SingleProjectRoutes, conn *sql.DB) SingleTaskRoutes {

	tasksController, taskStatusController := buildControllers(conn)
	taskStatusRoutes := singleProjectRoutes.Group("/task-status")
	taskStatusRoutes.GET("", taskStatusController.GetTaskStatusList)

	tasksRoutes := singleProjectRoutes.Group("/tasks")
	tasksRoutes.POST("", tasksController.CreateNewTask)

	singleProjectRoutes.GET("/tasks", tasksController.GetTasksGroupedBySprintsOfProject)

	singleTaskRoutes := tasksRoutes.Group(fmt.Sprintf(`/:%s`, tasks_controllers.TASK_ID_ROUTE_PARAM))
	singleTaskRoutes.GET("", tasksController.GetTaskByID)
	singleTaskRoutes.PATCH("", tasksController.UpdateTask)
	singleTaskRoutes.DELETE("", tasksController.DeleteTask)
	singleTaskRoutes.PATCH("/move", tasksController.MoveTask)

	return singleTaskRoutes

}

func buildControllers(conn *sql.DB) (*tasks_controllers.TasksController, *tasks_controllers.TaskStatusController) {
	userRepo := auth.NewUserRepository(conn)

	projectQueriesRepo := project.NewProjectQueriesRepository(conn)
	taskStatusRepo := tasks_repositories.NewTaskStatusRepository(conn)
	sprintRepo := sprints.NewSprintRepository(conn)
	sprintPointsRepo := sprint_points.NewSprintPointsRepository(conn)

	taskQueriesRepo := tasks_repositories.NewTaskQueriesRepository(conn)

	tagsService := tags.NewTagsService(conn)

	tasksQueriesService := tasks_queries.NewTasksQueriesService(tasks_queries.NewTaskQueriesRepository(conn))

	boardSprintsService := board.NewBoardSprintsService(sprintRepo, taskQueriesRepo, sprintPointsRepo, tasksQueriesService)

	tasksController := tasks_controllers.NewTasksController(userRepo, projectQueriesRepo, taskQueriesRepo, tagsService, boardSprintsService, conn)
	taskStatusController := tasks_controllers.NewTaskStatusController(taskStatusRepo)

	return tasksController, taskStatusController

}
