package auth

type SignInDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
