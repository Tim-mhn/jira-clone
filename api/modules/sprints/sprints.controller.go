package sprints

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/project"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
)

type SprintsController struct {
	sprintRepo SprintRepository
	service    SprintService
}

func NewSprintsController(sprintRepo SprintRepository, service SprintService) *SprintsController {
	return &SprintsController{
		sprintRepo: sprintRepo,
		service:    service,
	}
}

func (controller SprintsController) CreateSprint(c *gin.Context) {
	projectID := project.GetProjectIDParam(c)
	var newSprintDTO NewSprintDTO
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

func (controller SprintsController) UpdateSprint(c *gin.Context) {
	sprintID := c.Param("sprintID")

	var updateSprintDTO UpdateSprintDTO

	if err := c.BindJSON(&updateSprintDTO); err != nil {
		domainError := BuildSprintError(OtherSprintError, err)
		apiError := shared_errors.BuildAPIErrorFromDomainError(domainError)
		http_utils.ReturnJsonAndAbort(c, http.StatusUnprocessableEntity, apiError)
		return
	}

	err := controller.service.UpdateSprintName(sprintID, updateSprintDTO.Name)

	if err.HasError {
		statusCode := getHttpStatusCode(err)
		apiError := shared_errors.BuildAPIErrorFromDomainError(err)
		http_utils.ReturnJsonAndAbort(c, statusCode, apiError)
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

}

func getHttpStatusCode(err SprintError) int {
	if err.Code == SprintNotFound {
		return http.StatusBadRequest
	}

	if err.Code == UnauthorizedToChangeBacklogSprint {
		return http.StatusForbidden
	}

	return http.StatusInternalServerError
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