package notifications_api

import (
	"net/http"

	"github.com/stretchr/testify/mock"
)

type MockNotificationsAPI struct {
	mock.Mock
}

func (mock *MockNotificationsAPI) FollowTask(dto FollowTaskDTO, authCookie *http.Cookie) error {
	return nil
}
func (mock *MockNotificationsAPI) CreateCommentNotification(input CreateCommentNotificationInput, authCookie *http.Cookie) error {
	args := mock.Called(input, authCookie)
	errorOrNil := args.Get(0)
	if errorOrNil != nil {
		return errorOrNil.(error)
	}
	return nil
}
func (mock *MockNotificationsAPI) SendTaskAssignationNotification(input SendAssignationNotificationInput, authCookie *http.Cookie) error {
	mock.Called(input)
	return nil
}
