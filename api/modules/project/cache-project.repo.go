package project

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/tim-mhn/figma-clone/caching"
	"github.com/tim-mhn/figma-clone/modules/auth"
	time_utils "github.com/tim-mhn/figma-clone/utils/time"
)

type CacheProjectRepository struct {
	repo           ProjectRepository
	cachingService caching.CachingService
}

func NewProjectRepository(userRepo auth.UserRepository, conn *sql.DB) ProjectRepository {
	dbProjectRepo := &_SQLProjectRepository{
		conn:     conn,
		userRepo: userRepo,
	}

	cachingService := caching.GetCachingService()

	cacheProjectRepo := new(CacheProjectRepository)

	cacheProjectRepo.repo = dbProjectRepo
	cacheProjectRepo.cachingService = cachingService

	return cacheProjectRepo

}
func (cacheRepo CacheProjectRepository) GetProjectsOfUser(userID string) ([]Project, error) {

	time_utils.LogFunctionTime(time.Now(), "GetProjectsOfUser")
	cachedProjects, foundFromCache := cacheRepo.getProjectListFromCache(userID)

	if foundFromCache {
		return cachedProjects, nil
	}
	projects, err := cacheRepo.repo.GetProjectsOfUser(userID)
	if err == nil {
		cacheRepo.updateProjectListCache(userID, projects)
	}
	return projects, err

}

func (cacheRepo CacheProjectRepository) updateProjectListCache(userID string, projects []Project) {
	cacheRepo.cachingService.Update(userProjectsCacheKey(userID), projects)
}

func (cacheRepo CacheProjectRepository) getProjectListFromCache(userID string) ([]Project, bool) {
	cacheKey := userProjectsCacheKey(userID)

	cachedProjects, foundFromCache := cacheRepo.cachingService.Get(cacheKey)

	fmt.Printf("Found from cache ? %t", foundFromCache)
	if foundFromCache {
		return cachedProjects.([]Project), true
	}

	return []Project{}, false
}

func (cacheRepo CacheProjectRepository) CreateProject(name string, key string, creator auth.User) (Project, error) {

	newProject, err := cacheRepo.repo.CreateProject(name, key, creator)

	if err == nil {
		cacheRepo.invalidateUserProjectsCache(creator.Id)
	}

	return newProject, err
}

func (cacheRepo CacheProjectRepository) AddMemberToProject(projectID string, userID string) error {
	addMemberError := cacheRepo.repo.AddMemberToProject(projectID, userID)
	if addMemberError == nil {
		cacheRepo.invalidateUserProjectsCache(userID)
	}

	return addMemberError
}

func (cacheRepo CacheProjectRepository) invalidateUserProjectsCache(userID string) {
	cacheKey := userProjectsCacheKey(userID)
	cacheRepo.cachingService.Invalidate(cacheKey)
}
func userProjectsCacheKey(userID string) string {
	return fmt.Sprintf("user-projects-%s", userID)
}

func (cacheRepo CacheProjectRepository) DeleteProjectByID(projectID string) error {
	return cacheRepo.repo.DeleteProjectByID(projectID)
}

func (cacheRepo CacheProjectRepository) GetProjectByID(projectID string) (Project, error) {
	return cacheRepo.repo.GetProjectByID(projectID)
}
func (cacheRepo CacheProjectRepository) GetProjectMembers(projectID string) ([]ProjectMember, error) {
	return cacheRepo.repo.GetProjectMembers(projectID)
}
func (cacheRepo CacheProjectRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {
	return cacheRepo.repo.MemberIsInProject(projectID, memberID)
}
