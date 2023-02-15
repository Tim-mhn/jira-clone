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

	address := environments.GetEnv("address")
	fmt.Printf("Running add on %s", address)
	router.Run(address)
}
