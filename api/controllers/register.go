package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

func RegisterControllers(router *gin.Engine) {
	um := db.NewUserManager()
	tc := newTasksController(um)
	uc := newUserController(um)

	router.GET("/tasks", tc.getAllTasks)
	router.GET("/tasks/:id", tc.getTaskByID)
	router.POST("/tasks", tc.createNewTask)
	router.POST("/users", uc.createNewUser)

}
