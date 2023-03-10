package notifications_api

import (
	"fmt"
	"net/http"

	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

type NotificationsAPI interface {
	FollowTask(dto FollowTaskDTO, authCookie *http.Cookie) error
	CreateCommentNotification(dto NewCommentNotificationDTO, authCookie *http.Cookie) error
	SendTaskAssignationNotification() error
}

func NewNotificationsAPI() NotificationsAPI {
	return *new(NotificationsAPIImpl)
}

type NotificationsAPIImpl struct {
}

func (s NotificationsAPIImpl) FollowTask(dto FollowTaskDTO, authCookie *http.Cookie) error {

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

func (s NotificationsAPIImpl) CreateCommentNotification(dto NewCommentNotificationDTO, authCookie *http.Cookie) error {
	req := http_utils.BuildRequest(http_utils.POST, _COMMENT_TASK_URL, dto)
	req.AddCookie(authCookie)

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil

}

func (s NotificationsAPIImpl) SendTaskAssignationNotification() error {
	return nil
}
