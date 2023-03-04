package notifications

import (
	"context"
	"fmt"
	"net/http"

	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

const _NOTIFICATIONS_BASE_URL = "http://localhost:3000"

var _FOLLOW_TASK_URL = fmt.Sprintf("%s/follow", _NOTIFICATIONS_BASE_URL)

var _COMMENT_TASK_URL = fmt.Sprintf("%s/comment", _NOTIFICATIONS_BASE_URL)

func FollowTask(dto FollowTaskDTO, ctx context.Context) error {
	fmt.Println("Follow task called")

	b, err := http_utils.BufferJSON(dto)

	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", _FOLLOW_TASK_URL, b)

	if err != nil {
		return err
	}

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		return err
	}

	defer resp.Body.Close()
	return nil
}

func CreateCommentNotification(dto NewCommentNotificationDTO) {
	resp, err := http_utils.PostJSON(_COMMENT_TASK_URL, dto)

	if err == nil {
		defer resp.Body.Close()
	}

}
