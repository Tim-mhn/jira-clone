package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/environments"
)

func SetAuthCookieFromUser(user User, c *gin.Context) {
	ss := CreateJWTSignedString(user)

	c.SetCookie("Authorization", ss, 365*24*60*60, "/", environments.GetConfig().ClientDomain, true, true)

}
func DeleteAuthCookie(c *gin.Context) {
	cookie := &http.Cookie{
		Name:     "Authorization",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	}

	c.SetCookie(cookie.Name, cookie.Value, cookie.MaxAge, cookie.Path, environments.GetConfig().ClientDomain, true, true)
}
