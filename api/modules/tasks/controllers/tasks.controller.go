package tasks_controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type TasksController struct {
	taskQueries      *tasks_repositories.TaskQueriesRepository
	taskCommands     *tasks_repositories.TaskCommandsRepository
	sprintService    tasks_services.ISprintService
	taskPositionRepo *tasks_repositories.TaskPositionRepository
}

func NewTasksController(um *auth.UserRepository, projectQueries *project.ProjectQueriesRepository, sprintRepo *tasks_repositories.SprintRepository, taskRepo *tasks_repositories.TaskQueriesRepository, conn *sql.DB) *TasksController {
	sprintPointsRepo := tasks_repositories.NewSprintPointsRepository(conn)

	return &TasksController{
		taskQueries:      tasks_repositories.NewTaskQueriesRepository(um, conn),
		taskCommands:     tasks_repositories.NewTaskCommandsRepository(um, projectQueries, conn),
		sprintService:    tasks_services.NewSprintService(taskRepo, sprintRepo, sprintPointsRepo),
		taskPositionRepo: tasks_repositories.NewTaskPositionRepository(conn),
	}
}

func (tc *TasksController) GetTaskByID(c *gin.Context) {
	taskID := GetTaskIDParam(c)

	task, err := tc.taskQueries.GetTaskById(taskID)

	if err.HasError {
		buildAndReturnAPIError(c, err)
		return
	}

	// SprintInfo := tasks_models.SprintInfo{}

	// taskWithSprint.Id
	c.IndentedJSON(http.StatusOK, task)
}

func (tc *TasksController) CreateNewTask(c *gin.Context) {
	var taskDTO tasks_dtos.NewTaskDTO
	if err := c.BindJSON(&taskDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	projectID := project.GetProjectIDParam(c)
	newTask, newTaskErr := tc.taskCommands.CreateTask(projectID, taskDTO.SprintId, taskDTO.Title, taskDTO.AssigneeId, taskDTO.Points, taskDTO.Description)

	if newTaskErr != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, newTaskErr.Error())
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

	err := tc.taskCommands.UpdateTask(taskID, updateTaskDTO)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)
}

func (tc *TasksController) GetSprintsWithTasksOfProject(c *gin.Context) {
	projectID := c.Param("projectID")

	taskFilters := buildTasksFiltersFromRequest(c)

	log.Printf(`[TasksController.GetSprintsWithTasksOfProject] projectID=%s`, projectID)

	sprintListWithTasksDTO, err := tc.sprintService.GetSprintListWithTasks(projectID, taskFilters)

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
