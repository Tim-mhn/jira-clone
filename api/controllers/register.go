package controllers

import (
	"net/http"

	"github.com/tim-mhn/figma-clone/db"
)

func RegisterControllers() {
	um := db.NewUserManager()
	tc := newTasksController(um)
	uc := newUserController(um)

	http.Handle("/tasks", *tc)
	http.Handle("/tasks/", *tc)

	http.Handle("/users", *uc)

}
