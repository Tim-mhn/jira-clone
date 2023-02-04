package project

import (
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type Project struct {
	Id      string
	Name    string
	Key     string
	Icon    string
	Creator auth.User
}

type ProjectWithMembers struct {
	Id      string
	Name    string
	Key     string
	Members []auth.User
}
