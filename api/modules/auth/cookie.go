package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/environments"
	"github.com/tim-mhn/figma-clone/utils/arrays"
)

const AUTH_COOKIE_NAME = "Authorization"

const _COOKIE_MAX_AGE = 365 * 24 * 60 * 60
const _HTTP_ONLY = true
const _SECURE = true
const _COOKIE_PATH = "/"

func SetAuthCookieFromUser(user User, c *gin.Context) {
	ss := CreateJWTSignedString(user)
	c.SetCookie(AUTH_COOKIE_NAME, ss, _COOKIE_MAX_AGE, _COOKIE_PATH, environments.GetConfig().ClientDomain, _SECURE, _HTTP_ONLY)

}
func DeleteAuthCookie(c *gin.Context) {
	MAX_AGE := -1
	c.SetCookie(AUTH_COOKIE_NAME, "", MAX_AGE, _COOKIE_PATH, environments.GetConfig().ClientDomain, _SECURE, _HTTP_ONLY)
}

func GetAuthCookieFromContext(c *gin.Context) *http.Cookie {
	authCookie, _ := arrays.Find(c.Request.Cookies(), func(c *http.Cookie) bool {
		return c.Name == AUTH_COOKIE_NAME
	})

	return authCookie

}
