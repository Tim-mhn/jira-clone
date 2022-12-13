package models

type Status int64

const NEW_STATUS = 1

type TaskStatus struct {
	Id    int
	Label string
}
