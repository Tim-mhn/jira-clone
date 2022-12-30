package utils

import "fmt"

func GetUserIconPath(userId string) string {
	return fmt.Sprintf(`https://avatars.dicebear.com/api/avataaars/%s.svg`, userId)
}
