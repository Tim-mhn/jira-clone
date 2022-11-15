package controllers

import "net/http"

func RegisterControllers() {
	tc := newTasksController()
	http.Handle("/tasks", *tc)
	http.Handle("/tasks/", *tc)

}
