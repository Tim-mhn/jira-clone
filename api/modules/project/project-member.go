package project

import (
	"time"

	"github.com/tim-mhn/figma-clone/modules/auth"
)

type ProjectMember struct {
	auth.User
	JoinedOn time.Time
}
