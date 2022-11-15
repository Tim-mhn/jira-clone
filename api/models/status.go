package models

type Status int64

const (
	New Status = iota
	Ready
	Blocked
	Active
	Done
	Delivered
)
