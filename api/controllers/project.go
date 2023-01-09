package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/middlewares"
	"github.com/tim-mhn/figma-clone/models"
	"github.com/tim-mhn/figma-clone/repositories"
)

type projectController struct {
	projectRepo *repositories.ProjectRepository
}

type NewProjectDTO struct {
	Name string `json:"name"`
}

type AddMemberToProjectDTO struct {
	MemberID string `json:"memberID"`
}

func newProjectController(projectRepo *repositories.ProjectRepository) *projectController {
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
	user, _ := middlewares.GetUserFromRequestContext(c)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = pc.projectRepo.AddMemberToProject(newProject.Id, (user).Id)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusCreated, newProject)
}

func (pc *projectController) addMemberToProject(c *gin.Context) {
	projectID := getProjectIDParam(c)
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
	projectID := getProjectIDParam(c)

	projectInfo, err := pc.projectRepo.GetProjectMembers(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return

	}

	p := models.Project{
		Id:   projectInfo.Id,
		Name: projectInfo.Name,
	}
	c.IndentedJSON(http.StatusOK, p)

}

func (pc *projectController) getUserProjects(c *gin.Context) {
	user, _ := middlewares.GetUserFromRequestContext(c)

	userProjects, err := pc.projectRepo.GetProjectsOfUser(user.Id)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, userProjects)

}
