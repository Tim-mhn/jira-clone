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

	environments.LoadVariables()

	if environments.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	db := database.ConnectToDatabase()
	defer db.Close()

	router := gin.Default()

	if environments.IsProduction() {
		config := cors.DefaultConfig()

		config.AllowOrigins = []string{environments.GetConfig().ClientURL, environments.GetConfig().DevClientURL}
		config.AllowCredentials = true
		router.Use(cors.New(config))
	}

	endpoints.RegisterAllEndpoints(router, db)

	host := environments.GetConfig().Host
	port := environments.GetConfig().Port
	ADDRESS := fmt.Sprintf("%s:%s", host, port)
	fmt.Printf("\n\nRunning app on %s\nEnvironment: %s\n\n. ", ADDRESS, getEnv())
	router.Run(ADDRESS)
}

func getEnv() string {
	if environments.IsProduction() {
		return "production"
	}

	return "development"
}
