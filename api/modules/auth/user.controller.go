package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type userController struct {
	um *UserRepository
}

func NewUserController(um *UserRepository) *userController {
	return &userController{
		um: um,
	}
}

func (uc *userController) SignUp(c *gin.Context) {
	var userDTO SignUpDTO
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

func (uc *userController) SignIn(c *gin.Context) {

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

	SetAuthCookieFromUser(user, c)
	c.IndentedJSON(http.StatusOK, nil)

}

func (uc *userController) Me(c *gin.Context) {

	user, _ := GetUserFromRequestContext(c)

	c.IndentedJSON(http.StatusOK, user)

}

func (uc *userController) SignOut(c *gin.Context) {
	cookie := &http.Cookie{
		Name:     "Authorization",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	}

	c.SetCookie(cookie.Name, cookie.Value, cookie.MaxAge, cookie.Path, "localhost", true, true)
	c.IndentedJSON(http.StatusOK, nil)
}