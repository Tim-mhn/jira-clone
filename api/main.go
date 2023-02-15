package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/endpoints"
	"github.com/tim-mhn/figma-clone/environments"
)

func main() {
	environments.LoadVariables()

	db := database.ConnectToDatabase()
	defer db.Close()

	router := gin.Default()
	endpoints.RegisterAllEndpoints(router, db)

	host := environments.GetEnv("HOST")
	port := environments.GetEnv("PORT")
	ADDRESS := fmt.Sprintf("%s:%s", host, port)
	fmt.Printf("\n\nRunning app on %s\n\n", ADDRESS)
	router.Run(ADDRESS)
}
