package tasks_controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	notifications_api "github.com/tim-mhn/figma-clone/modules/notifications"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type TasksController struct {
	taskQueries      *tasks_repositories.TaskQueriesRepository
	sprintService    tasks_services.ITasksQueriesService
	taskPositionRepo *tasks_repositories.TaskPositionRepository
	taskCommands     tasks_services.TaskCommandsService
	notificationsAPI notifications_api.NotificationsAPI
}

func NewTasksController(um *auth.UserRepository, projectQueries project.ProjectQueriesRepository, service tasks_services.ITasksQueriesService, taskRepo *tasks_repositories.TaskQueriesRepository, tagsService tags.ITagsService, conn *sql.DB) *TasksController {

	taskCommandsRepo := tasks_repositories.NewSQLTaskCommandsRepository(um, projectQueries, conn)

	return &TasksController{
		taskQueries:      tasks_repositories.NewTaskQueriesRepository(um, conn),
		sprintService:    service,
		taskCommands:     *tasks_services.NewTaskCommandsService(taskCommandsRepo, tagsService, projectQueries),
		taskPositionRepo: tasks_repositories.NewTaskPositionRepository(conn),
		notificationsAPI: notifications_api.NewNotificationsAPI(),
	}
}

func (tc *TasksController) GetTaskByID(c *gin.Context) {
	taskID := GetTaskIDParam(c)

	task, err := tc.taskQueries.GetTaskById(taskID)

	if err.HasError {
		buildAndReturnAPIError(c, err)
		return
	}

	c.IndentedJSON(http.StatusOK, task)
}

func (tc *TasksController) CreateNewTask(c *gin.Context) {
	var taskDTO tasks_dtos.NewTaskDTO
	if err := c.BindJSON(&taskDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	projectID := project.GetProjectIDParam(c)

	createTaskInput := tasks_services.CreateTaskInput{
		ProjectID:   projectID,
		SprintID:    taskDTO.SprintId,
		Title:       taskDTO.Title,
		Description: taskDTO.Description,
		AssigneeID:  taskDTO.AssigneeId,
	}

	// todo: improve error handling and return API Error
	newTask, newTaskErr := tc.taskCommands.CreateTask(createTaskInput)

	if newTaskErr.HasError {
		apiError := shared_errors.BuildAPIErrorFromDomainError(newTaskErr)
		c.IndentedJSON(http.StatusUnprocessableEntity, apiError)
		return
	}

	currentUser, _ := auth.GetUserFromRequestContext(c)

	authCookie := auth.GetAuthCookieFromContext(c)

	err := tc.notificationsAPI.FollowTask(notifications_api.FollowTaskDTO{
		UserID: currentUser.Id,
		TaskID: *newTask.Id,
	}, authCookie)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.IndentedJSON(http.StatusCreated, newTask.Id)

}

func (tc *TasksController) UpdateTask(c *gin.Context) {
	var updateTaskDTO tasks_dtos.PatchTaskDTO
	taskID := GetTaskIDParam(c)
	if err := c.BindJSON(&updateTaskDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	authCookie := auth.GetAuthCookieFromContext(c)
	currentUser, _ := auth.GetUserFromRequestContext(c)
	projectID := project.GetProjectIDParam(c)

	updateTaskInput := tasks_services.UpdateTaskInput{
		TaskID:         taskID,
		NewData:        updateTaskDTO,
		UpdatingUserID: currentUser.Id,
		ProjectID:      projectID,
		AuthCookie:     authCookie,
	}

	updateTaskError := tc.taskCommands.UpdateTask(updateTaskInput)

	if updateTaskError.HasError {
		apiError := shared_errors.BuildAPIErrorFromDomainError(updateTaskError)
		c.IndentedJSON(http.StatusUnprocessableEntity, apiError)
		return
	}

	c.IndentedJSON(http.StatusOK, nil)
}

func (tc *TasksController) GetTasksGroupedBySprintsOfProject(c *gin.Context) {
	projectID := c.Param("projectID")

	taskFilters := buildTasksFiltersFromRequest(c)

	log.Printf(`[TasksController.GetTasksGroupedBySprintsOfProject] projectID=%s`, projectID)

	sprintListWithTasksDTO, err := tc.sprintService.GetTasksGroupedBySprint(projectID, taskFilters)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, sprintListWithTasksDTO)
}

func buildTasksFiltersFromRequest(c *gin.Context) tasks_models.TaskFilters {
	assigneeIdList := c.QueryArray("assigneeId[]")
	statusStringList := c.QueryArray("status[]")
	typesStringList := c.QueryArray("type[]")

	statusListInts := arrays.MapStringsToInts(statusStringList)
	typesListInts := arrays.MapStringsToInts(typesStringList)

	return tasks_models.TaskFilters{
		AssigneeIds:  assigneeIdList,
		TaskStatuses: statusListInts,
		TaskTypes:    typesListInts,
	}

}

func (tc *TasksController) DeleteTask(c *gin.Context) {
	taskID := GetTaskIDParam(c)

	res, err := tc.taskCommands.DeleteTask(taskID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	if res.NotFound {
		c.IndentedJSON(http.StatusNotFound, fmt.Sprintf(`could not find task %s`, taskID))
	}

	c.IndentedJSON(http.StatusNoContent, nil)
}

func (tc *TasksController) MoveTask(c *gin.Context) {
	taskID := GetTaskIDParam(c)

	var MoveTaskDTO tasks_dtos.MoveTaskDTO
	if err := c.BindJSON(&MoveTaskDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	err := tc.taskPositionRepo.MoveTaskBetween(taskID, MoveTaskDTO)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)

}
