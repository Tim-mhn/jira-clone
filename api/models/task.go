package models

type Task struct {
	Id, Points int
	Assignee   User
	Title      string
	Status     Status
}
