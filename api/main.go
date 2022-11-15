package main

import (
	"fmt"
	"net/http"

	"github.com/tim-mhn/figma-clone/controllers"
	"github.com/tim-mhn/figma-clone/models"
)

func main() {
	t := models.Task{
		Assignee: models.User{
			Id:   1,
			Name: "Bob",
		},
		Id:     1,
		Points: 5,
	}

	fmt.Println(t)

	// tasks := db.GetAllTasks()

	// for _, task := range tasks {
	// 	fmt.Println(task)
	// }

	controllers.RegisterControllers()
	http.ListenAndServe(":3000", nil)

}
