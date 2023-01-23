package project

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type projectController struct {
	projectCommands *ProjectCommandsRepository
	projectQueries  *ProjectQueriesRepository
}

type NewProjectDTO struct {
	Name string `json:"name"`
	Key  string `json:"key"`
}

type AddMemberToProjectDTO struct {
	MemberID string `json:"memberID"`
}

func NewProjectController(projectCommands *ProjectCommandsRepository, projectQueries *ProjectQueriesRepository) *projectController {
	return &projectController{
		projectCommands: projectCommands,
		projectQueries:  projectQueries,
	}
}

func (pc *projectController) CreateProject(c *gin.Context) {
	var newProjectDTO NewProjectDTO
	if err := c.BindJSON(&newProjectDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	user, _ := auth.GetUserFromRequestContext(c)

	newProject, err := pc.projectCommands.CreateProject(newProjectDTO.Name, newProjectDTO.Key, *user)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	err = pc.projectCommands.AddMemberToProject(newProject.Id, (user).Id)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusCreated, newProject)
}

func (pc *projectController) AddMemberToProject(c *gin.Context) {
	projectID := GetProjectIDParam(c)
	var addMemberToProjectDTO AddMemberToProjectDTO

	c.BindJSON(&addMemberToProjectDTO)

	err := pc.projectCommands.AddMemberToProject(projectID, addMemberToProjectDTO.MemberID)

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

}

func (pc *projectController) GetProject(c *gin.Context) {
	projectID := GetProjectIDParam(c)

	project, err := pc.projectQueries.GetProjectByID(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return

	}

	c.IndentedJSON(http.StatusOK, project)

}

func (pc *projectController) GetProjectMembers(c *gin.Context) {
	projectID := GetProjectIDParam(c)

	members, err := pc.projectQueries.GetProjectMembers(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, members)

}

func (pc *projectController) GetUserProjects(c *gin.Context) {

	log.Println("ProjectController.GetUserProjects called")
	user, _ := auth.GetUserFromRequestContext(c)

	userProjects, err := pc.projectQueries.GetProjectsOfUser(user.Id)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, userProjects)

}
