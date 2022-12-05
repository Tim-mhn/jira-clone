package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

type userController struct {
	um *db.UserRepository
}

type NewUserDTO struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func newUserController(um *db.UserRepository) *userController {
	return &userController{
		um: um,
	}
}

func (uc *userController) createNewUser(c *gin.Context) {
	var userDTO NewUserDTO
	if err := c.BindJSON(&userDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	userId, dbError := uc.um.CreateUser(userDTO.Name, userDTO.Email, userDTO.Password)

	if dbError != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, dbError.Error())
		return

	}
	c.IndentedJSON(http.StatusCreated, userId)
}
