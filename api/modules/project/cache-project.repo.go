package project

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/caching"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type CacheProjectRepository struct {
	repo           ProjectRepository
	cachingService caching.CachingService
}

func (cacheRepo CacheProjectRepository) GetProjectsOfUser(userID string) ([]Project, error) {

	cachedProjects, foundFromCache := cacheRepo.getProjectListFromCache(userID)

	if foundFromCache {
		return cachedProjects, nil
	}
	return cacheRepo.repo.GetProjectsOfUser(userID)
}

func (cacheRepo CacheProjectRepository) getProjectListFromCache(userID string) ([]Project, bool) {
	cacheKey := userProjectsCacheKey(userID)

	cachedProjects, foundFromCache := cacheRepo.cachingService.Get(cacheKey)

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
