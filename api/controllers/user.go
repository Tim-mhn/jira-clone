package controllers

import (
	"net/http"

	"github.com/tim-mhn/figma-clone/db"
)

type userController struct {
	um *db.UserManager
}

type NewUserDTO struct {
	Name string `json:"name"`
}

func (uc userController) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {

	case http.MethodPost:
		var dto NewUserDTO
		DecodeBody(r, &dto)
		newUser := uc.um.CreateUser(dto.Name)
		encodeResponseAsJson(newUser, w)
	}
}

func newUserController(um *db.UserManager) *userController {
	return &userController{
		um: um,
	}
}
