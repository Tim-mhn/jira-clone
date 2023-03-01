package task_comments

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/notifications"
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

	notifications.CreateCommentNotification(notifications.NewCommentNotificationDTO{
		TaskID:  taskID,
		Comment: createCommentDTO.Text,
		Author: notifications.CommentAuthor{
			Name: currentUser.Name,
			ID:   currentUser.Id,
		},
	})

	c.IndentedJSON(http.StatusOK, nil)

}

func (controller TaskCommentsController) getTaskComments(c *gin.Context) {
	taskID := tasks_controllers.GetTaskIDParam(c)

	comments, err := controller.repo.getTaskComments(taskID)

	if err.HasError {
		buildAndReturnAPIErrorResponse(c, err)
		return
	}
	c.IndentedJSON(http.StatusOK, comments)
}

func (controller TaskCommentsController) deleteComment(c *gin.Context) {
	commentID := c.Param("commentID")

	err := controller.repo.deleteComment(commentID)

	if err.HasError {
		buildAndReturnAPIErrorResponse(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, nil)
}

func (controller TaskCommentsController) updateComment(c *gin.Context) {
	commentID := c.Param("commentID")

	if len(commentID) == 0 || strings.TrimSpace(commentID) == "" {
		domainError := buildCommentsError(InvalidPayload, fmt.Errorf("commentID should not be empty in endpoint"))
		buildAndReturnAPIErrorResponse(c, domainError)
		return
	}

	var dto EditCommentDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		domainError := buildCommentsError(InvalidPayload, err)
		buildAndReturnAPIErrorResponse(c, domainError)
		return
	}

	editComment := EditCommentInput{
		Text:      dto.Text,
		CommentID: commentID,
	}
	err := controller.repo.editCommentText(editComment)

	if err.HasError {
		buildAndReturnAPIErrorResponse(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

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

	case CommentNotFound:
		return http.StatusBadRequest
	}

	return http.StatusInternalServerError
}
