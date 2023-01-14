package project

import "fmt"

func getProjectIcon(projectID string) string {
	return fmt.Sprintf(`https://api.dicebear.com/5.x/icons/svg?seed=%s`, projectID)

}
