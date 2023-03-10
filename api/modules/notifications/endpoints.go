package notifications_api

import "fmt"

const _NOTIFICATIONS_BASE_URL = "http://localhost:3000"

var _FOLLOW_TASK_URL = fmt.Sprintf("%s/follow", _NOTIFICATIONS_BASE_URL)

var _COMMENT_TASK_URL = fmt.Sprintf("%s/comment", _NOTIFICATIONS_BASE_URL)
