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
	taskRepo := repositories.NewTaskRepository(userRepo, projectRepo, conn)

	tc := newTasksController(userRepo, projectRepo, conn)
	uc := newUserController(userRepo)
	pc := newProjectController(projectRepo, taskRepo)

	router.POST("/sign-up", uc.signUp)
	router.POST("/sign-in", uc.signIn)

	projectsRoutes := router.Group("/projects", middlewares.IsAuthenticatedMiddleware())

	projectsRoutes.GET("", pc.getUserProjects)

	singleProjectRoutes := projectsRoutes.Group(
		fmt.Sprintf(`/:%s`, PROJECT_ID_ROUTE_PARAM),
		middlewares.CanAccessProjectMiddleware(projectRepo))

	tasksRoutes := singleProjectRoutes.Group("/tasks")
	tasksRoutes.GET("", tc.getProjectTasks)
	tasksRoutes.POST("", tc.createNewTask)

	singleTaskRoutes := tasksRoutes.Group(fmt.Sprintf(`/:%s`, TASK_ID_ROUTE_PARAM))
	singleTaskRoutes.GET("", tc.getTaskByID)
	singleTaskRoutes.PATCH("", tc.updateTaskStatus)

	projectsRoutes.POST("", pc.createProject)
	singleProjectRoutes.GET("", pc.getProject)
	singleProjectRoutes.POST("/members/add", pc.addMemberToProject)

}
