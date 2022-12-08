package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
	"github.com/tim-mhn/figma-clone/utils"
)

type userController struct {
	um *db.UserRepository
}

type NewUserDTO struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignInDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func newUserController(um *db.UserRepository) *userController {
	return &userController{
		um: um,
	}
}

func (uc *userController) signUp(c *gin.Context) {
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

func (uc *userController) signIn(c *gin.Context) {

	var signInDTO SignInDTO
	if err := c.BindJSON(&signInDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	user, signInErr := uc.um.SignInByEmail(signInDTO.Email, signInDTO.Password)

	if signInErr != nil {
		c.IndentedJSON(http.StatusForbidden, signInErr.Error())
		return
	}

	ss := utils.CreateJWTSignedString(user)

	token, _ := utils.ParseTokenString(ss)

	c.SetCookie("Authorization", ss, 365*24*60*60, "/", "localhost", true, true)
	c.IndentedJSON(http.StatusOK, token)

}
