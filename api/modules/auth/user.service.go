package auth

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}
func (service UserService) GetUserFromEmail(email string) (User, UsersError) {

	userWithPwd, userError := service.repo.GetUserInfoByEmail(email)

	if userError.HasError {
		return User{}, userError
	}

	user := User{
		Id:    userWithPwd.Id,
		Name:  userWithPwd.Name,
		Email: userWithPwd.Email,
		Icon:  userWithPwd.Icon,
	}
	return user, NoUsersError()
}
