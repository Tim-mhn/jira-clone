package controllers

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
	"github.com/tim-mhn/figma-clone/middlewares"
)

func RegisterControllers(router *gin.Engine, conn *sql.DB) {
	um := db.NewUserRepository(conn)
	pm := db.NewProjectRepository(um, conn)
	tc := newTasksController(um, pm, conn)
	uc := newUserController(um)
	pc := newProjectController(pm)

	router.POST("/sign-up", uc.signUp)
	router.POST("/sign-in", uc.signIn)

	projectsRoutes := router.Group("/projects", middlewares.IsAuthenticatedMiddleware())

	singleProjectRoutes := projectsRoutes.Group(fmt.Sprintf(`/:%s`, PROJECT_ID_ROUTE_PARAM), middlewares.CanAccessProjectMiddleware(pm))

	tasksRoutes := singleProjectRoutes.Group("/tasks")
	tasksRoutes.GET("", tc.getProjectTasks)
	tasksRoutes.POST("", tc.createNewTask)
	tasksRoutes.GET(fmt.Sprintf(`/:%s`, TASK_ID_ROUTE_PARAM), tc.getTaskByID)

	projectsRoutes.POST("", pc.createProject)
	singleProjectRoutes.GET("", pc.getProject)
	singleProjectRoutes.POST("/members/add", pc.addMemberToProject)

}
