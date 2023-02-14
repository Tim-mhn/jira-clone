package tags

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/project"
)

type TagsController struct {
	service ITagsService
}

func NewTagsController(service ITagsService) TagsController {
	return TagsController{
		service: service,
	}
}

func (controller TagsController) GetTaskTagTemplate(c *gin.Context) {

	tagTemplate := controller.service.GetTaskTagTemplate()
	c.IndentedJSON(http.StatusOK, tagTemplate)
}

func (controller TagsController) CreateTagForProject(c *gin.Context) {

	projectID := project.GetProjectIDParam(c)

	var dto _CreateTagDTO

	if err := c.BindJSON(&dto); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	err := controller.service.CreateTagForProject(dto.Tag, projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err)
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

}

func (controller TagsController) GetTagsOfProject(c *gin.Context) {
	projectID := project.GetProjectIDParam(c)

	tags, err := controller.service.GetProjectTags(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err)
		return
	}

	c.IndentedJSON(http.StatusOK, tags)
}
