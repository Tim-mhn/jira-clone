package task_comments

import (
	"time"

	"github.com/tim-mhn/figma-clone/modules/auth"
)

type TaskComment struct {
	Id, Text  string
	Author    auth.User
	CreatedOn time.Time
}

type TaskComments = []TaskComment
