package controllers

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/middlewares"
	"github.com/tim-mhn/figma-clone/repositories"
)

func RegisterControllers(router *gin.Engine, conn *sql.DB) {
	userRepo := repositories.NewUserRepository(conn)
	projectRepo := repositories.NewProjectRepository(userRepo, conn)
	taskStatusRepo := repositories.NewTaskStatusRepository(conn)
	sprintRepo := repositories.NewSprintRepository(conn)
	taskQueriesRepo := repositories.NewTaskQueriesRepository(userRepo, projectRepo, conn)

	tc := newTasksController(userRepo, projectRepo, sprintRepo, taskQueriesRepo, conn)
	uc := newUserController(userRepo)
	pc := newProjectController(projectRepo)
	tsc := newTaskStatusController(taskStatusRepo)

	router.POST("/sign-up", uc.signUp)
	router.POST("/sign-in", uc.signIn)
	router.POST("/sign-out", uc.signOut)

	requiresAuthRoutes := router.Group("", middlewares.IsAuthenticatedMiddleware())
	requiresAuthRoutes.GET("/me", middlewares.IsAuthenticatedMiddleware(), uc.me)

	projectsRoutes := requiresAuthRoutes.Group("/projects")

	projectsRoutes.GET("", pc.getUserProjects)

	singleProjectRoutes := projectsRoutes.Group(
		fmt.Sprintf(`/:%s`, PROJECT_ID_ROUTE_PARAM),
		middlewares.CanAccessProjectMiddleware(projectRepo))

	taskStatusRoutes := singleProjectRoutes.Group("/task-status")
	taskStatusRoutes.GET("", tsc.getTaskStatusList)

	tasksRoutes := singleProjectRoutes.Group("/tasks")
	tasksRoutes.POST("", tc.createNewTask)

	singleProjectRoutes.GET(`/sprints`, tc.getSprintsWithTasksOfProject)

	singleTaskRoutes := tasksRoutes.Group(fmt.Sprintf(`/:%s`, TASK_ID_ROUTE_PARAM))
	singleTaskRoutes.GET("", tc.getTaskByID)
	singleTaskRoutes.PATCH("", tc.UpdateTask)
	singleTaskRoutes.DELETE("", tc.deleteTask)
	singleTaskRoutes.PATCH("/move", tc.moveTask)

	projectsRoutes.POST("", pc.createProject)
	singleProjectRoutes.GET("", pc.getProject)
	singleProjectRoutes.GET("/members", pc.getProjectMembers)
	singleProjectRoutes.POST("/members/add", pc.addMemberToProject)

}
