package task_comments

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	tasks_controllers "github.com/tim-mhn/figma-clone/modules/tasks/controllers"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
	http_utils "github.com/tim-mhn/figma-clone/utils/http"
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
		domainError := buildCommentsError(InvalidPayload, err)
		buildAndReturnAPIErrorResponse(c, domainError)
		return
	}

	createCommentInput := CreateCommentInput{
		Text:     createCommentDTO.Text,
		AuthorID: currentUser.Id,
		TaskID:   taskID,
	}

	err := controller.repo.createComment(createCommentInput)

	if err.HasError {
		buildAndReturnAPIErrorResponse(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

}

func (controller TaskCommentsController) getTaskComments(c *gin.Context) {
	taskID := c.Param("taskID")

	comments, err := controller.repo.getTaskComments(taskID)

	if err.HasError {
		buildAndReturnAPIErrorResponse(c, err)
		return
	}
	c.IndentedJSON(http.StatusOK, comments)
}

var (
	getUserFromRequestContext = auth.GetUserFromRequestContext
)

func buildAndReturnAPIErrorResponse(c *gin.Context, err CommentsError) {
	code := getHttpStatusCode(err)
	apiResponse := shared_errors.BuildAPIErrorFromDomainError(err)
	http_utils.ReturnJsonAndAbort(c, code, apiResponse)

}

func (controller TaskCommentsController) getCurrentUser(c *gin.Context) auth.User {
	currentUser, _ := getUserFromRequestContext(c)
	return *currentUser
}

func getHttpStatusCode(err CommentsError) int {
	switch err.Code {
	case TaskNotFound:
		return http.StatusBadRequest
	case InvalidPayload:
		return http.StatusBadRequest
	}

	return http.StatusInternalServerError
}
