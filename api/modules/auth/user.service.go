package auth

type UserService struct {
	repo *UserRepository
}

func NewUserService(repo *UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}
func (service UserService) GetUserFromEmail(email string) (User, error) {

	userWithPwd, err := service.repo.getUserInfoByEmail(email)

	if err != nil {
		return User{}, err
	}

	return User{
		Id:    userWithPwd.Id,
		Name:  userWithPwd.Name,
		Email: userWithPwd.Email,
		Icon:  userWithPwd.Icon,
	}, nil
}
