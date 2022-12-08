package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/tim-mhn/figma-clone/models"
)

type ClaimsUserInfo struct {
	Email    string `json:"email"`
	Username string `json:"username"`
}
type MyClaims struct {
	ClaimsUserInfo
	jwt.RegisteredClaims
}

func getAuthSigningKey() []byte {
	return []byte("YkuAXXapTc")
}

func CreateJWTSignedString(user models.User) string {
	claims := MyClaims{
		ClaimsUserInfo{
			Email:    user.Email,
			Username: user.Name,
		},
		jwt.RegisteredClaims{
			ID:        user.Id,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedString, _ := token.SignedString(getAuthSigningKey())
	return signedString
}

func ParseStringToJWT(signedString string) (*jwt.Token, error) {
	token, err := jwt.Parse(signedString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return getAuthSigningKey(), nil
	})

	return token, err
}
