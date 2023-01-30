package task_comments

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	tasks_controllers "github.com/tim-mhn/figma-clone/modules/tasks/controllers"
)

type TaskCommentsController struct {
	repo TaskCommentsRepository
}

func newTaskCommentsController(repo TaskCommentsRepository) *TaskCommentsController {
	return &TaskCommentsController{
		repo: repo,
	}
}

func (controller TaskCommentsController) postComment(c *gin.Context) {
	taskID := tasks_controllers.GetTaskIDParam(c)

	currentUser := controller.getCurrentUser(c)
	var createCommentDTO CreateCommentDTO
	if err := c.ShouldBindJSON(&createCommentDTO); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	createCommentInput := CreateCommentInput{
		Text:     createCommentDTO.Text,
		AuthorID: currentUser.Id,
		TaskID:   taskID,
	}

	err := controller.repo.createComment(createCommentInput)

	if err.HasError {
		code := getHttpStatusCode(err)
		c.IndentedJSON(code, err.Code.UserFriendlyString())
		c.Abort()
	}

	c.IndentedJSON(http.StatusOK, nil)

}

var (
	getUserFromRequestContext = auth.GetUserFromRequestContext
)

func (controller TaskCommentsController) getCurrentUser(c *gin.Context) auth.User {
	currentUser, _ := getUserFromRequestContext(c)
	return *currentUser
}

func getHttpStatusCode(err CommentsError) int {
	switch err.Code {
	case TaskNotFound:
		return http.StatusBadRequest
	}

	return http.StatusInternalServerError
}
