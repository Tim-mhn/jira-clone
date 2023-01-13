package auth

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func IsAuthenticatedMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		authString, noCookieFoundError := c.Cookie("Authorization")

		if noCookieFoundError != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, "missing token in cookie")
			return
		}

		user, tokenError := ParseTokenString(authString)

		if tokenError != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, "invalid token")
			return
		}
		setUserInRequestContext(c, user)
		c.Next()
	}
}

func GetUserFromRequestContext(c *gin.Context) (*User, error) {
	user, exists := c.Get("user")

	if !exists {
		return &User{}, fmt.Errorf("missing user from middleware context")
	}

	u, ok := user.(User)

	if !ok {
		return &User{}, fmt.Errorf("error when casting user in middleware context")
	}

	return &u, nil

}

func setUserInRequestContext(c *gin.Context, user User) {
	c.Set("user", user)
}
