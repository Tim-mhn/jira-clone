package database

import (
	"database/sql"
	"log"

	"github.com/tim-mhn/figma-clone/environments"
)

func ConnectToDatabase() *sql.DB {
	dbDriver := environments.GetEnv("database.driver")
	dbUrl := environments.GetEnv("database.url")

	db, err := sql.Open(dbDriver, dbUrl)

	if err != nil {
		log.Fatalf(`error connecting to db: %s`, err.Error())
	}
	return db
}
