package tasks_controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
)

type SprintsController struct {
	sprintRepo *tasks_repositories.SprintRepository
	service    *tasks_services.SprintService
}

func NewSprintsController(sprintRepo *tasks_repositories.SprintRepository, service *tasks_services.SprintService) *SprintsController {
	return &SprintsController{
		sprintRepo: sprintRepo,
		service:    service,
	}
}

func (controller SprintsController) CreateSprint(c *gin.Context) {
	projectID := project.GetProjectIDParam(c)
	var newSprintDTO tasks_dtos.NewSprintDTO
	if err := c.BindJSON(&newSprintDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	sprintID, err := controller.sprintRepo.CreateSprint(newSprintDTO.Name, projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusCreated, sprintID)
}

func (controller SprintsController) DeleteSprint(c *gin.Context) {
	sprintID := c.Param("sprintID")

	err := controller.sprintRepo.DeleteSprint(sprintID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)
}

func (controller SprintsController) MarkSprintAsCompleted(c *gin.Context) {
	sprintID := c.Param("sprintID")

	err := controller.sprintRepo.MarkSprintAsCompleted(sprintID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)
}

func (controller SprintsController) GetActiveSprintsOfProject(c *gin.Context) {
	projectID := project.GetProjectIDParam(c)

	activeSprints, err := controller.service.GetActiveSprintsOfProject(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, activeSprints)

}
