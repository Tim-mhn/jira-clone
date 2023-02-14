package tags

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
