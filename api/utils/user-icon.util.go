package utils

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

func getUserIconPath(userId string) string {
	if userId == "" {
		return ""
	}
	return fmt.Sprintf(`https://avatars.dicebear.com/api/avataaars/%s.svg`, userId)
}

func BuildUserWithIcon(userId string, name string, email string) models.User {
	icon := getUserIconPath(userId)
	return models.User{
		Id:    userId,
		Name:  name,
		Email: email,
		Icon:  icon,
	}
}
