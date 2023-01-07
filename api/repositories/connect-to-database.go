package repositories

import (
	"database/sql"
	"fmt"
)

func ConnectToDatabase() *sql.DB {
	psqlconn := "postgresql://postgres:cyBYv6a3jgQ4NddgsUYs@containers-us-west-73.railway.app:7740/railway"
	db, err := sql.Open("postgres", psqlconn)

	if err != nil {
		fmt.Println("error connecting to db")
		fmt.Println(err.Error())
	}
	return db
}
