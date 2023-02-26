package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetAuthCookieFromUser(user User, c *gin.Context) {
	ss := CreateJWTSignedString(user)

	c.SetCookie("Authorization", ss, 365*24*60*60, "/", "", true, true)
	// http.SetCookie(c.Writer, &http.Cookie{
	// 	Name:     "Authorization",
	// 	Value:    url.QueryEscape(ss),
	// 	MaxAge:   365 * 24 * 60 * 60,
	// 	Path:     "/",
	// 	Domain:   "localhost",
	// 	SameSite: http.SameSiteDefaultMode,
	// 	Secure:   true,
	// 	HttpOnly: true,
	// })
}
func DeleteAuthCookie(c *gin.Context) {
	cookie := &http.Cookie{
		Name:     "Authorization",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	}

	c.SetCookie(cookie.Name, cookie.Value, cookie.MaxAge, cookie.Path, ".app.localhost", true, true)
}
