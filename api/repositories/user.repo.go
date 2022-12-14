package repositories

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
	"github.com/tim-mhn/figma-clone/utils"
	"golang.org/x/crypto/bcrypt"
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

	hashedPwd, _ := hashAndSalt(password)
	query := fmt.Sprintf(`INSERT INTO "user" (name, email, password) VALUES ('%s', '%s', '%s') RETURNING id, name, email;`, username, email, hashedPwd)
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

	if !rows.Next() {

		return models.User{}, fmt.Errorf(`could not find user %s`, userID)

	}

	scanError := rows.Scan(&user.Id, &user.Name, &user.Email)

	if scanError != nil {
		return models.User{}, scanError
	}

	userWithIcon := utils.BuildUserWithIcon(user.Id, user.Name, user.Email)
	return userWithIcon, scanError

}

func (um *UserRepository) getUserInfoByEmail(email string) (models.UserWithPassword, error) {

	var userWithPwd models.UserWithPassword
	query := fmt.Sprintf(`SELECT password, email, id, name FROM "user" WHERE email='%s' LIMIT 1;`, email)
	rows, err := um.conn.Query(query)

	if err != nil {
		return models.UserWithPassword{}, err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&userWithPwd.Password, &userWithPwd.Email, &userWithPwd.Id, &userWithPwd.Name)

		if err != nil {
			return models.UserWithPassword{}, err
		}

	}

	return userWithPwd, nil
}

func (um *UserRepository) SignInByEmail(email string, password string) (models.User, error) {

	userWithPwd, err := um.getUserInfoByEmail(email)

	if err != nil {
		return models.User{}, err
	}

	if !passwordIsCorrect(password, userWithPwd.Password) {
		return models.User{}, fmt.Errorf("invalid password")
	}

	user := utils.BuildUserWithIcon(userWithPwd.Id, userWithPwd.Name, userWithPwd.Email)

	return user, nil
}

func hashAndSalt(pwd string) (string, error) {

	// Use GenerateFromPassword to hash & salt pwd.
	// MinCost is just an integer constant provided by the bcrypt
	// package along with DefaultCost & MaxCost.
	// The cost can be any value you want provided it isn't lower
	// than the MinCost (4)
	bytesPwd := []byte(pwd)

	hash, err := bcrypt.GenerateFromPassword(bytesPwd, bcrypt.MinCost)

	if err != nil {
		return "", err
	} // GenerateFromPassword returns a byte slice so we need to
	// convert the bytes to a string and return it
	return string(hash), nil
}

func passwordIsCorrect(unhashedPassord string, userPassword string) bool {
	errorIfIncorrect := bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(unhashedPassord))
	return errorIfIncorrect == nil

}
