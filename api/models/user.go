package models

type User struct {
	Id    string
	Name  string
	Email string
	Icon  string
}

type UserWithPassword struct {
	Password string
	User
}
