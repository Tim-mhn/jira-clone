package controllers

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

func RegisterControllers(router *gin.Engine, conn *sql.DB) {
	um := db.NewUserRepository(conn)
	pm := db.NewProjectManager(um)
	tc := newTasksController(um, pm)
	uc := newUserController(um)
	pc := newProjectController(pm)

	router.GET("/tasks", tc.getAllTasks)
	router.GET("/tasks/:id", tc.getTaskByID)
	router.POST("/tasks", tc.createNewTask)
	router.POST("/users", uc.createNewUser)
	router.POST("/projects", pc.createProject)

}
