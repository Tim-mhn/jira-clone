package controllers

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/middlewares"
	"github.com/tim-mhn/figma-clone/repositories"
)

func RegisterControllers(router *gin.Engine, conn *sql.DB) {
	um := repositories.NewUserRepository(conn)
	pm := repositories.NewProjectRepository(um, conn)
	tc := newTasksController(um, pm, conn)
	uc := newUserController(um)
	pc := newProjectController(pm)

	router.POST("/sign-up", uc.signUp)
	router.POST("/sign-in", uc.signIn)

	projectsRoutes := router.Group("/projects", middlewares.IsAuthenticatedMiddleware())

	projectsRoutes.GET("", pc.getUserProjects)

	singleProjectRoutes := projectsRoutes.Group(
		fmt.Sprintf(`/:%s`, PROJECT_ID_ROUTE_PARAM),
		middlewares.CanAccessProjectMiddleware(pm))

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
