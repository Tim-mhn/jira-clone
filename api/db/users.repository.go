package db

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

type UserRepository struct {
	lastUserID int
	users      []models.User
	conn       *sql.DB
}

type NewUserResult struct {
	id    string
	name  string
	email string
}

func NewUserRepository(conn *sql.DB) *UserRepository {
	um := UserRepository{}

	um.users = []models.User{}
	um.lastUserID = 0
	um.conn = conn

	return &um
}

func (um *UserRepository) CreateUser(username string, email string, password string) (string, error) {

	query := fmt.Sprintf(`INSERT INTO "user" (name, email, password) VALUES ('%s', '%s', '%s') RETURNING id, name, email;`, username, email, password)
	var newUser NewUserResult
	rows, err := um.conn.Query(query)

	if err != nil {
		return "", err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&newUser.id, &newUser.name, &newUser.email)

		if err != nil {
			return "", err
		}
		fmt.Println(newUser)

	}

	return newUser.id, err
}

func (um *UserRepository) GetUserByID(userID int) (models.User, error) {
	for _, u := range um.users {
		if u.Id == userID {
			return u, nil
		}
	}

	return models.User{}, fmt.Errorf("user not found")
}
