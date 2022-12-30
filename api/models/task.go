package models

type Task struct {
	Points                 int
	Assignee               User
	Id, Title, Description *string
	Status                 TaskStatus
}
