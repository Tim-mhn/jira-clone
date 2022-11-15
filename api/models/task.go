package models

type Task struct {
	Id, Points int
	Assignee   User
}
