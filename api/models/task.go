package models

type Task struct {
	Points    int
	Assignee  User
	Id, Title string
	Status    Status
}
