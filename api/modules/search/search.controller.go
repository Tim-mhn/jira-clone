package search

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type SearchController struct {
	service *SearchService
}

func NewSearchController(service *SearchService) *SearchController {
	return &SearchController{
		service: service,
	}
}

func (controller *SearchController) SearchTasksWithMatchingContentInUserProjects(c *gin.Context) {
	currentUser, _ := auth.GetUserFromRequestContext(c)
	searchContent := c.Query("content")
	searchInput := SearchInput{
		UserID: currentUser.Id,
		Text:   searchContent,
	}

	searchResults, err := controller.service.searchTasksOrSprintsOfUserByText(searchInput)

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
	}

	c.IndentedJSON(http.StatusOK, searchResults)
}
