package project

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

func TestGetProjectsOfUser(t *testing.T) {

	t.Run("it should call the ProjectRepo if there are no cached results from the CachingService", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()
		userID := "user-id-123"
		mockCachingService.On("Get", mock.Anything).Return(nil, false)
		mockCachingService.On("Update", mock.Anything, mock.Anything).Return(nil)

		mockProjectRepo.On("GetProjectsOfUser", userID).Return([]Project{}, nil)

		cacheRepo.GetProjectsOfUser(userID)

		mockProjectRepo.AssertCalled(t, "GetProjectsOfUser", userID)

	})

	t.Run("it should set the cache if there are no cached results", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()
		userID := "user-id-123"
		mockCachingService.On("Get", mock.Anything).Return(nil, false)
		mockCachingService.On("Update", mock.Anything, mock.Anything).Return(nil)

		mockProjectRepo.On("GetProjectsOfUser", userID).Return([]Project{}, nil)

		userProjects, _ := cacheRepo.GetProjectsOfUser(userID)

		mockCachingService.AssertCalled(t, "Update", mock.Anything, userProjects)
	})

	t.Run("it should not update the cache if there are no cached results and the repo returns an error", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()
		userID := "user-id-123"
		mockCachingService.On("Get", mock.Anything).Return(nil, false)
		mockCachingService.On("Update", mock.Anything, mock.Anything).Return(nil)

		mockProjectRepo.On("GetProjectsOfUser", userID).Return([]Project{}, fmt.Errorf("error when retrieving project list"))

		cacheRepo.GetProjectsOfUser(userID)

		mockCachingService.AssertNotCalled(t, "Update", mock.Anything, mock.Anything)
	})

	t.Run("it should NOT call the ProjectRepo if is a valid cache", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()
		userID := "user-id-123"

		mockCachedProjectList := []Project{}
		mockCachingService.On("Get", mock.Anything).Return(mockCachedProjectList, true)
		mockProjectRepo.On("GetProjectsOfUser", userID).Return([]Project{}, nil)

		cacheRepo.GetProjectsOfUser(userID)

		mockProjectRepo.AssertNotCalled(t, "GetProjectsOfUser", userID)

	})
}

func TestCreateProject(t *testing.T) {
	t.Run("it should invalidate the cache of the project list of the creator", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()

		creatorID := "creator-id-123"

		newProjectName := "newProject"
		newProjectKey := "NP"
		creator := auth.User{
			Id: creatorID,
		}

		mockCachingService.On("Invalidate", mock.Anything).Return(nil)
		mockProjectRepo.On("CreateProject", mock.Anything).Return(Project{}, nil)

		cacheRepo.CreateProject(newProjectName, newProjectKey, creator)

		mockCachingService.AssertCalled(t, "Invalidate", mock.Anything)

	})

	t.Run("it should not invalidate the cache of the project list of the creator if there is an error in the creation", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()

		creatorID := "creator-id-123"

		newProjectName := "newProject"
		newProjectKey := "NP"
		creator := auth.User{
			Id: creatorID,
		}

		projectCreationError := fmt.Errorf("error when creating the project")

		mockCachingService.On("Invalidate", mock.Anything).Return(nil)
		mockProjectRepo.On("CreateProject", mock.Anything).Return(Project{}, projectCreationError)

		cacheRepo.CreateProject(newProjectName, newProjectKey, creator)

		mockCachingService.AssertNotCalled(t, "Invalidate", mock.Anything)

	})
}

func TestAddMemberToProject(t *testing.T) {

	projectID := "project-id-123"
	newMemberId := "user-aze-123"
	t.Run("it should call the repo.AddMemberToProject method", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()
		mockProjectRepo.On("AddMemberToProject", projectID, newMemberId).Return(nil)
		mockCachingService.On("Invalidate", mock.Anything).Return(nil)

		cacheRepo.AddMemberToProject(projectID, newMemberId)

		mockProjectRepo.AssertCalled(t, "AddMemberToProject", projectID, newMemberId)

	})

	t.Run("it should invalidate the cache of the new member", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()
		mockProjectRepo.On("AddMemberToProject", projectID, newMemberId).Return(nil)
		mockCachingService.On("Invalidate", mock.Anything).Return(nil)
		cacheRepo.AddMemberToProject(projectID, newMemberId)

		mockCachingService.AssertCalled(t, "Invalidate", mock.Anything)

	})

	t.Run("it should not invalidate the cache of the new member if there is an error when adding the member", func(t *testing.T) {
		cacheRepo, mockProjectRepo, mockCachingService := setupRepoAndMocks()
		mockProjectRepo.On("AddMemberToProject", projectID, newMemberId).Return(fmt.Errorf("error when adding member"))
		mockCachingService.On("Invalidate", mock.Anything).Return(nil)
		cacheRepo.AddMemberToProject(projectID, newMemberId)

		mockCachingService.AssertNotCalled(t, "Invalidate", mock.Anything)

	})
}

func setupRepoAndMocks() (*CacheProjectRepository, *MockProjectRepository, *MockCachingService) {
	mockProjectRepo := new(MockProjectRepository)
	mockCachingService := new(MockCachingService)
	cacheRepo := new(CacheProjectRepository)
	cacheRepo.cachingService = mockCachingService
	cacheRepo.repo = mockProjectRepo
	return cacheRepo, mockProjectRepo, mockCachingService
}

type MockCachingService struct {
	mock.Mock
}

func (mockCachingService *MockCachingService) Get(key string) (interface{}, bool) {
	args := mockCachingService.Called(key)
	return args.Get(0), args.Get(1).(bool)
}
func (mockCachingService *MockCachingService) Invalidate(key string) {
	mockCachingService.Called(key)
}

func (mockCachingService *MockCachingService) Update(key string, data interface{}) {
	mockCachingService.Called(key, data)
}
