package notifications_api

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/environments"
)

var (
	notificationsBaseUrlFn = _NOTIFICATIONS_BASE_URL
)

func _NOTIFICATIONS_BASE_URL() string {
	return environments.GetConfig().NotificationsAPIURL
}

func _FOLLOW_TASK_URL() string {
	return fmt.Sprintf("%s/follow", notificationsBaseUrlFn())
}

func _COMMENT_TASK_URL() string {
	return fmt.Sprintf("%s/comment", notificationsBaseUrlFn())
}

func _ASSIGNATION_URL() string {
	return fmt.Sprintf("%s/assignation", notificationsBaseUrlFn())
}
