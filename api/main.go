package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/endpoints"
	"github.com/tim-mhn/figma-clone/environments"
)

func main() {

	//todo:
	// - clean up variables logic (try to use Viper for os variables)
	// - meta variable with host + address
	// - add proxy check
	environments.LoadVariables()

	db := database.ConnectToDatabase()
	defer db.Close()

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}

	router.Use(cors.New(config))
	endpoints.RegisterAllEndpoints(router, db)

	host := environments.GetConfig().Host
	port := environments.GetConfig().Port
	ADDRESS := fmt.Sprintf("%s:%s", host, port)
	fmt.Printf("\n\nRunning app on %s\n\n", ADDRESS)
	router.Run(ADDRESS)
}
