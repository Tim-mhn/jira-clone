package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

type projectController struct {
	pm *db.ProjectManager
}

type NewProjectDTO struct {
	Name string `json:"name"`
}

func newProjectController(pm *db.ProjectManager) *projectController {
	return &projectController{
		pm: pm,
	}
}

func (pc *projectController) createProject(c *gin.Context) {
	var newProjectDTO NewProjectDTO
	if err := c.BindJSON(&newProjectDTO); err != nil {
		return
	}
	newProject := pc.pm.CreateProject(newProjectDTO.Name)

	c.IndentedJSON(http.StatusCreated, newProject)
}
