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
	tasks_repositories "github.com/tim-mhn/figma-clone/modules/tasks/repositories"
	tasks_services "github.com/tim-mhn/figma-clone/modules/tasks/services"
)

type tasksController struct {
	taskQueries      *tasks_repositories.TaskQueriesRepository
	taskCommands     *tasks_repositories.TaskCommandsRepository
	sprintService    *tasks_services.SprintService
	taskPositionRepo *tasks_repositories.TaskPositionRepository
}

func NewTasksController(um *auth.UserRepository, pm *project.ProjectRepository, sprintRepo *tasks_repositories.SprintRepository, taskRepo *tasks_repositories.TaskQueriesRepository, conn *sql.DB) *tasksController {
	sprintPointsRepo := tasks_repositories.NewSprintPointsRepository(conn)

	return &tasksController{
		taskQueries:      tasks_repositories.NewTaskQueriesRepository(um, pm, conn),
		taskCommands:     tasks_repositories.NewTaskCommandsRepository(um, pm, conn),
		sprintService:    tasks_services.NewSprintService(taskRepo, sprintRepo, sprintPointsRepo),
		taskPositionRepo: tasks_repositories.NewTaskPositionRepository(conn),
	}
}

func (tc *tasksController) GetTaskByID(c *gin.Context) {
	taskID := getTaskIDParam(c)

	task, err := tc.taskQueries.GetTaskById(taskID)

	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	c.IndentedJSON(http.StatusOK, task)
}

func (tc *tasksController) CreateNewTask(c *gin.Context) {
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

	c.IndentedJSON(http.StatusCreated, newTask)

}

func (tc *tasksController) UpdateTask(c *gin.Context) {
	var updateTaskDTO tasks_dtos.PatchTaskDTO
	taskID := getTaskIDParam(c)
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

func (tc *tasksController) GetSprintsWithTasksOfProject(c *gin.Context) {
	projectID := c.Param("projectID")
	log.Printf(`[tasksController.GetSprintsWithTasksOfProject] projectID=%s`, projectID)

	sprintListWithTasksDTO, err := tc.sprintService.GetSprintListWithTasks(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, sprintListWithTasksDTO)
}

func (tc *tasksController) DeleteTask(c *gin.Context) {
	taskID := getTaskIDParam(c)

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

func (tc *tasksController) MoveTask(c *gin.Context) {
	taskID := getTaskIDParam(c)

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