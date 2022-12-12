package middlewares

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/models"
	"github.com/tim-mhn/figma-clone/utils"
)

func IsAuthenticatedMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		authString, noCookieFoundError := c.Cookie("Authorization")

		if noCookieFoundError != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, "missing token in cookie")
			return
		}

		user, tokenError := utils.ParseTokenString(authString)

		if tokenError != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, "invalid token")
			return
		}
		setUserInRequestContext(c, user)
		c.Next()
	}
}

func GetUserFromRequestContext(c *gin.Context) (models.User, error) {
	user, exists := c.Get("user")

	if !exists {
		return models.User{}, fmt.Errorf("missing user from middleware context")
	}

	u, ok := user.(models.User)

	if !ok {
		return models.User{}, fmt.Errorf("error when casting user in middleware context")
	}

	return u, nil

}

func setUserInRequestContext(c *gin.Context, user models.User) {
	c.Set("user", user)
}
