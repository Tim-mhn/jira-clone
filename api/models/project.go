package models

type Project struct {
	Id   string
	Name string
}

type ProjectWithMembers struct {
	Id      string
	Name    string
	Members []User
}
