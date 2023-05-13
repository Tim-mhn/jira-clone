package project

import (
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
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
	args := mock.Called(userID)
	errorOrNil := tests_utils.CastToErrorIfNotNil(args.Get(1))
	return args.Get(0).([]Project), errorOrNil
}
func (mock *MockProjectRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {
	return true, nil
}

func (mock *MockProjectRepository) CreateProject(name string, key string, creator auth.User) (Project, error) {

	args := mock.Called("CreateProject")

	errorOrNil := tests_utils.CastToErrorIfNotNil(args.Get(1))
	return args.Get(0).(Project), errorOrNil
}
func (mock *MockProjectRepository) AddMemberToProject(projectID string, userID string) error {
	args := mock.Called(projectID, userID)
	return tests_utils.CastToErrorIfNotNil(args.Get(0))
}
func (mock *MockProjectRepository) DeleteProjectByID(projectID string) error {
	return nil
}
