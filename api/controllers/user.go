package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

type userController struct {
	um *db.UserManager
}

type NewUserDTO struct {
	Name string `json:"name"`
}

func newUserController(um *db.UserManager) *userController {
	return &userController{
		um: um,
	}
}

func (uc *userController) createNewUser(c *gin.Context) {
	var userDTO NewUserDTO
	if err := c.BindJSON(&userDTO); err != nil {
		return
	}
	newUser := uc.um.CreateUser(userDTO.Name)

	c.IndentedJSON(http.StatusCreated, newUser)
}
