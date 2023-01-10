package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/tim-mhn/figma-clone/controllers"
	"github.com/tim-mhn/figma-clone/repositories"
	"github.com/tim-mhn/figma-clone/utils/environments"
)

func main() {
	environments.LoadVariables()
	db := repositories.ConnectToDatabase()
	defer db.Close()

	router := gin.Default()
	controllers.RegisterControllers(router, db)
	router.Run("localhost:8080")
}
