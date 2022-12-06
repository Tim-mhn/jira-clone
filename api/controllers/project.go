package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

type projectController struct {
	projectRepo *db.ProjectRepository
}

type NewProjectDTO struct {
	Name string `json:"name"`
}

type AddMemberToProjectDTO struct {
	MemberID string `json:"memberID"`
}

func newProjectController(projectRepo *db.ProjectRepository) *projectController {
	return &projectController{
		projectRepo: projectRepo,
	}
}

func (pc *projectController) createProject(c *gin.Context) {
	var newProjectDTO NewProjectDTO
	if err := c.BindJSON(&newProjectDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	newProject, err := pc.projectRepo.CreateProject(newProjectDTO.Name)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.IndentedJSON(http.StatusCreated, newProject)
}

func (pc *projectController) addMemberToProject(c *gin.Context) {
	projectID := c.Param("id")
	var addMemberToProjectDTO AddMemberToProjectDTO

	c.BindJSON(&addMemberToProjectDTO)

	err := pc.projectRepo.AddMemberToProject(projectID, addMemberToProjectDTO.MemberID)

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

}

func (pc *projectController) getProject(c *gin.Context) {
	projectID := c.Param("id")

	project, err := pc.projectRepo.GetProjectMembers(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return

	}

	c.IndentedJSON(http.StatusOK, project)

}
