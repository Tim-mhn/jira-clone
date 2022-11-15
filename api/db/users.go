package db

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

type UserManager struct {
	lastUserID int
	users      []models.User
}

func NewUserManager() *UserManager {
	um := UserManager{}

	um.users = []models.User{}
	um.lastUserID = 0

	return &um
}
func (um *UserManager) CreateUser(username string) models.User {
	newUserID := um.lastUserID + 1
	um.lastUserID += 1

	newUser := models.User{
		Id:   newUserID,
		Name: username,
	}

	um.users = append(um.users, newUser)

	return newUser
}

func (um *UserManager) GetUserByID(userID int) (models.User, error) {
	for _, u := range um.users {
		if u.Id == userID {
			return u, nil
		}
	}

	return models.User{}, fmt.Errorf("user not found")
}
