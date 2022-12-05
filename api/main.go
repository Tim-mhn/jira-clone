package main

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/tim-mhn/figma-clone/controllers"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "figma"
)

func main() {

	psqlconn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlconn)

	if err != nil {
		fmt.Println("error connecting to db")
		fmt.Println(err.Error())
	}
	defer db.Close()

	router := gin.Default()
	controllers.RegisterControllers(router, db)
	router.Run("localhost:8080")
}
