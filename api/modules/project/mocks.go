package project

import (
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

func NewMockProjectRepository() *MockProjectRepository {
	return new(MockProjectRepository)
}

type MockProjectRepository struct {
	mock.Mock
}

func (mock *MockProjectRepository) GetProjectByID(projectID string) (Project, error) {
	args := mock.Called(projectID)
	return args.Get(0).(Project), nil
}
func (mock *MockProjectRepository) GetProjectMembers(projectID string) ([]ProjectMember, error) {
	return []ProjectMember{}, nil
}
func (mock *MockProjectRepository) GetProjectsOfUser(userID string) ([]Project, error) {
	return []Project{}, nil
}
func (mock *MockProjectRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {
	return true, nil
}

func (mock *MockProjectRepository) CreateProject(name string, key string, creator auth.User) (Project, error) {
	return Project{}, nil
}
func (mock *MockProjectRepository) AddMemberToProject(projectID string, userID string) error {
	return nil
}
func (mock *MockProjectRepository) DeleteProjectByID(projectID string) error {
	return nil
}
