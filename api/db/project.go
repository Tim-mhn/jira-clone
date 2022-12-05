package db

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

type ProjectManager struct {
	lastProjectID int
	projects      []models.Project
	um            *UserRepository
}

func NewProjectManager(um *UserRepository) *ProjectManager {
	return &ProjectManager{
		lastProjectID: 0,
		projects:      []models.Project{},
		um:            um,
	}

}

func (pm *ProjectManager) CreateProject(name string) models.Project {
	newProjectID := pm.lastProjectID + 1
	pm.lastProjectID = newProjectID

	newProject := models.Project{
		Id:      newProjectID,
		Name:    name,
		Tasks:   []models.Task{},
		Members: []models.User{},
	}

	pm.projects = append(pm.projects, newProject)

	return newProject
}

func (pm *ProjectManager) getProjectByID(projectID int) (models.Project, error) {
	for _, p := range pm.projects {
		if p.Id == projectID {
			return p, nil
		}
	}

	return models.Project{}, fmt.Errorf("project not found")

}

func (pm *ProjectManager) memberIsInProject(project models.Project, memberID string) bool {
	for _, member := range project.Members {
		if member.Id == memberID {
			return true
		}
	}

	return false
}

func (pm *ProjectManager) AddMemberToProject(projectID int, userID string) (models.Project, error) {

	project, getProjectErr := pm.getProjectByID(projectID)

	if getProjectErr != nil {
		return models.Project{}, getProjectErr
	}

	user, getUserErr := pm.um.GetUserByID(userID)

	if getUserErr != nil {
		return models.Project{}, getUserErr
	}

	if pm.memberIsInProject(project, user.Id) {
		return models.Project{}, fmt.Errorf("member is already in project")
	}

	project.Members = append(project.Members, user)

	return project, nil

}
