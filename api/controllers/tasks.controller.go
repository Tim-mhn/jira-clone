package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/dtos"
	"github.com/tim-mhn/figma-clone/repositories"
	"github.com/tim-mhn/figma-clone/services"
)

type tasksController struct {
	taskQueries   *repositories.TaskQueriesRepository
	taskCommands  *repositories.TaskCommandsRepository
	sprintService *services.SprintService
}

func newTasksController(um *repositories.UserRepository, pm *repositories.ProjectRepository, sprintRepo *repositories.SprintRepository, taskRepo *repositories.TaskQueriesRepository, conn *sql.DB) *tasksController {
	return &tasksController{
		taskQueries:   repositories.NewTaskQueriesRepository(um, pm, conn),
		taskCommands:  repositories.NewTaskCommandsRepository(um, pm, conn),
		sprintService: services.NewSprintService(taskRepo, sprintRepo),
	}
}

func (tc *tasksController) getTaskByID(c *gin.Context) {
	taskID := getTaskIDParam(c)

	task, err := tc.taskQueries.GetTaskById(taskID)

	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	c.IndentedJSON(http.StatusOK, task)
}

func (tc *tasksController) createNewTask(c *gin.Context) {
	var taskDTO dtos.NewTaskDTO
	if err := c.BindJSON(&taskDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	projectID := getProjectIDParam(c)
	newTask, newTaskErr := tc.taskCommands.CreateTask(projectID, taskDTO.SprintId, taskDTO.Title, taskDTO.AssigneeId, taskDTO.Points, taskDTO.Description)

	if newTaskErr != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, newTaskErr.Error())
		return
	}

	c.IndentedJSON(http.StatusCreated, newTask)

}

func (tc *tasksController) UpdateTask(c *gin.Context) {
	var updateTaskDTO dtos.PatchTaskDTO
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

func (tc *tasksController) getSprintsWithTasksOfProject(c *gin.Context) {
	projectID := c.Param("projectID")
	log.Printf(`[tasksController.getSprintsWithTasksOfProject] projectID=%s`, projectID)

	sprintListWithTasksDTO, err := tc.sprintService.GetSprintListWithTasks(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, sprintListWithTasksDTO)
}

func (tc *tasksController) deleteTask(c *gin.Context) {
	taskID := c.Param("taskID")

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
