package auth

import (
	"fmt"
)

func getUserIconPath(userId string) string {
	if userId == "" {
		return ""
	}
	return fmt.Sprintf(`https://avatars.dicebear.com/api/avataaars/%s.svg`, userId)
}

func BuildUserWithIcon(userId string, name string, email string) User {
	icon := getUserIconPath(userId)
	return User{
		Id:    userId,
		Name:  name,
		Email: email,
		Icon:  icon,
	}
}
