package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

type tasksController struct {
	tm *db.TaskRepository
}

const TASK_ID_ROUTE_PARAM string = "taskID"

type NewTaskDTO struct {
	Points     int    `json:"points"`
	Title      string `json:"title"`
	AssigneeID string `json:"assigneeID"`
}

func newTasksController(um *db.UserRepository, pm *db.ProjectRepository, conn *sql.DB) *tasksController {
	return &tasksController{
		tm: db.NewTaskRepository(um, pm, conn),
	}
}

func (tc *tasksController) getProjectTasks(c *gin.Context) {

	projectID := c.Param(PROJECT_ID_ROUTE_PARAM)

	tasks, err := tc.tm.GetProjectTasks(projectID)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.IndentedJSON(http.StatusOK, tasks)
}

func (tc *tasksController) getTaskByID(c *gin.Context) {
	taskID := c.Param(TASK_ID_ROUTE_PARAM)

	task, err := tc.tm.GetTaskById(taskID)

	if err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	c.IndentedJSON(http.StatusOK, task)
}

func (tc *tasksController) createNewTask(c *gin.Context) {
	var taskDTO NewTaskDTO
	if err := c.BindJSON(&taskDTO); err != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	projectID := c.Param(PROJECT_ID_ROUTE_PARAM)
	newTask, newTaskErr := tc.tm.CreateTask(taskDTO.Points, taskDTO.Title, taskDTO.AssigneeID, projectID)

	if newTaskErr != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, newTaskErr.Error())
		return
	}

	c.IndentedJSON(http.StatusCreated, newTask)

}
