package project

import "github.com/stretchr/testify/mock"

func NewMockProjectQueriesRepository() *MockProjectQueriesRepository {
	return new(MockProjectQueriesRepository)
}

type MockProjectQueriesRepository struct {
	mock.Mock
}

func (mock *MockProjectQueriesRepository) GetProjectByID(projectID string) (Project, error) {
	args := mock.Called(projectID)
	return args.Get(0).(Project), nil
}
func (mock *MockProjectQueriesRepository) GetProjectMembers(projectID string) ([]ProjectMember, error) {
	return []ProjectMember{}, nil
}
func (mock *MockProjectQueriesRepository) GetProjectsOfUser(userID string) ([]Project, error) {
	return []Project{}, nil
}
func (mock *MockProjectQueriesRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {
	return true, nil
}
