package db

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

type UserRepository struct {
	conn *sql.DB
}

func NewUserRepository(conn *sql.DB) *UserRepository {
	um := UserRepository{}
	um.conn = conn

	return &um
}

func (um *UserRepository) CreateUser(username string, email string, password string) (string, error) {

	query := fmt.Sprintf(`INSERT INTO "user" (name, email, password) VALUES ('%s', '%s', '%s') RETURNING id, name, email;`, username, email, password)
	var newUser models.User
	rows, err := um.conn.Query(query)

	if err != nil {
		return "", err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&newUser.Id, &newUser.Name, &newUser.Email)

		if err != nil {
			return "", err
		}
		fmt.Println(newUser)

	}

	return newUser.Id, err
}

func (um *UserRepository) GetUserByID(userID string) (models.User, error) {

	var user models.User
	query := fmt.Sprintf(`SELECT id, name, email FROM "user" WHERE id='%s' LIMIT 1;`, userID)
	rows, err := um.conn.Query(query)

	if err != nil {
		return user, err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&user.Id, &user.Name, &user.Email)

		if err != nil {
			return user, err
		}

	}

	return user, nil
}
