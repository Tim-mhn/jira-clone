package models

type Project struct {
	Id      int
	Name    string
	Tasks   []Task
	Members []User
}
