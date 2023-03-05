package notifications

import (
	"fmt"
	"net/http"

	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

const _NOTIFICATIONS_BASE_URL = "http://localhost:3000"

var _FOLLOW_TASK_URL = fmt.Sprintf("%s/follow", _NOTIFICATIONS_BASE_URL)

var _COMMENT_TASK_URL = fmt.Sprintf("%s/comment", _NOTIFICATIONS_BASE_URL)

func FollowTask(dto FollowTaskDTO, authCookie *http.Cookie) error {

	req := http_utils.BuildRequest(http_utils.POST, _FOLLOW_TASK_URL, dto)
	req.AddCookie(authCookie)

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("error in follow task. Returned status: %d", resp.StatusCode)
	}

	return nil
}

func CreateCommentNotification(dto NewCommentNotificationDTO, authCookie *http.Cookie) error {
	req := http_utils.BuildRequest(http_utils.POST, _COMMENT_TASK_URL, dto)
	req.AddCookie(authCookie)

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil

}
