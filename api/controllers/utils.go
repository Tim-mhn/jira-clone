package controllers

import (
	"encoding/json"
	"net/http"
)

func DecodeBody[T any](r *http.Request, dto *T) *T {
	json.NewDecoder(r.Body).Decode(&dto)
	return dto
}
