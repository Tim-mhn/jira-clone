package search

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type SearchController struct {
	repo *SearchTasksRepository
}

func NewSearchController(repo *SearchTasksRepository) *SearchController {
	return &SearchController{
		repo: repo,
	}
}

func (controller *SearchController) SearchTasksWithMatchingContentInUserProjects(c *gin.Context) {
	currentUser, _ := auth.GetUserFromRequestContext(c)
	searchContent := c.Query("content")

	taskInfoList, err := controller.repo.SearchTasksWithMatchingContentInUserProjects(UserID(currentUser.Id), SearchText(searchContent))

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
	}

	c.IndentedJSON(http.StatusOK, taskInfoList)
}
