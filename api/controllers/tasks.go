package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/dtos"
	"github.com/tim-mhn/figma-clone/repositories"
)

type tasksController struct {
	tm *repositories.TaskRepository
}

func newTasksController(um *repositories.UserRepository, pm *repositories.ProjectRepository, conn *sql.DB) *tasksController {
	return &tasksController{
		tm: repositories.NewTaskRepository(um, pm, conn),
	}
}

func (tc *tasksController) getProjectTasks(c *gin.Context) {

	projectID := getProjectIDParam(c)

	tasks, err := tc.tm.GetProjectTasks(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.IndentedJSON(http.StatusOK, tasks)
}

func (tc *tasksController) getTaskByID(c *gin.Context) {
	taskID := getTaskIDParam(c)

	task, err := tc.tm.GetTaskById(taskID)

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
	newTask, newTaskErr := tc.tm.CreateTask(projectID, taskDTO.Title, taskDTO.AssigneeId, taskDTO.Points, taskDTO.Description)

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

	err := tc.tm.UpdateTask(taskID, updateTaskDTO)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.IndentedJSON(http.StatusOK, nil)
}
