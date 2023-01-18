package auth

type UsersError int

const (
	NoUserError UsersError = iota
	UserNotFound
)
