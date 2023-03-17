package notifications_api

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/environments"
)

func _NOTIFICATIONS_BASE_URL() string {
	return environments.GetConfig().NotificationsAPIURL
}

func _FOLLOW_TASK_URL() string {
	return fmt.Sprintf("%s/follow", _NOTIFICATIONS_BASE_URL())
}

func _COMMENT_TASK_URL() string {
	return fmt.Sprintf("%s/comment", _NOTIFICATIONS_BASE_URL())
}

func _ASSIGNATION_URL() string {
	return fmt.Sprintf("%s/assignation", _NOTIFICATIONS_BASE_URL())
}
