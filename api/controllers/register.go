package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

func RegisterControllers(router *gin.Engine) {
	um := db.NewUserManager()
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
