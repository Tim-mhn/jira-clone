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

type NewTaskDTO struct {
	Points     int    `json:"points"`
	Title      string `json:"title"`
	AssigneeID string `json:"assigneeID"`
	ProjectID  string `json:"projectID"`
}

func newTasksController(um *db.UserRepository, pm *db.ProjectRepository, conn *sql.DB) *tasksController {
	return &tasksController{
		tm: db.NewTaskRepository(um, pm, conn),
	}
}

func (tc *tasksController) getAllTasks(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, tc.tm.GetAllTasks())
}

func (tc *tasksController) getTaskByID(c *gin.Context) {
	taskID := c.Param("id")

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
		return
	}
	newTask, newTaskErr := tc.tm.CreateTask(taskDTO.Points, taskDTO.Title, taskDTO.AssigneeID, taskDTO.ProjectID)

	if newTaskErr != nil {
		c.IndentedJSON(http.StatusUnprocessableEntity, newTaskErr.Error())
		return
	}

	c.IndentedJSON(http.StatusCreated, newTask)

}
