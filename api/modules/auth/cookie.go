package auth

import (
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

// todo: look into
/*
*Set-Cookie
was blocked because its Domain attribute was invalid
with regards to the current host url
*/
func SetAuthCookieFromUser(user User, c *gin.Context) {
	ss := CreateJWTSignedString(user)

	// c.SetCookie("Authorization", ss, 365*24*60*60, "/", "tim-jira.netlify.app", true, true)
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "Authorization",
		Value:    url.QueryEscape(ss),
		MaxAge:   365 * 24 * 60 * 60,
		Path:     "/",
		Domain:   "",
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
		HttpOnly: false,
	})
}
func DeleteAuthCookie(c *gin.Context) {
	cookie := &http.Cookie{
		Name:     "Authorization",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	}

	c.SetCookie(cookie.Name, cookie.Value, cookie.MaxAge, cookie.Path, "", true, false)
}
