package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/tim-mhn/figma-clone/models"
)

func getAuthSigningKey() []byte {
	return []byte("YkuAXXapTc")
}

func CreateJWTSignedString(user models.User) string {
	claims := &jwt.MapClaims{
		"iss":  "issuer",
		"exp":  time.Now().Add(time.Hour).Unix(),
		"data": user,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedString, _ := token.SignedString(getAuthSigningKey())
	return signedString
}

func ParseTokenString(tokenString string) (models.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return getAuthSigningKey(), nil
	})

	if err != nil {
		return models.User{}, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return models.User{}, fmt.Errorf("error when transforming token.Claims into ClaimsUserInfo object")
	}
	data := claims["data"].(map[string]interface{})
	id := data["Id"].(string)
	email := data["Email"].(string)
	username := data["Name"].(string)

	return models.User{
		Id:    id,
		Email: email,
		Name:  username,
	}, nil
}
