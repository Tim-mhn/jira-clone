package auth

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

func RegisterEndpoints(router *gin.Engine, conn *sql.DB) {
	userRepo := NewUserRepository(conn)
	uc := NewUserController(userRepo)

	router.POST("/sign-up", uc.SignUp)
	router.POST("/sign-in", uc.SignIn)
	router.POST("/sign-out", uc.SignOut)

	router.GET("/me", IsAuthenticatedMiddleware(), uc.Me)
}
