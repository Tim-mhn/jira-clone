package controllers

import (
	"net/http"
	"regexp"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/db"
)

type tasksController struct {
	tm            *db.TaskManager
	taskIDPattern *regexp.Regexp
}

type NewTaskDTO struct {
	Points     int    `json:"points"`
	Title      string `json:"title"`
	AssigneeID int    `json:"assigneeID"`
}

func newTasksController(um *db.UserManager) *tasksController {
	return &tasksController{
		tm:            db.NewTaskManager(um),
		taskIDPattern: regexp.MustCompile(`^/tasks/(\d+)`),
	}
}

func (tc *tasksController) getAllTasks(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, tc.tm.GetAllTasks())
}

func (tc *tasksController) getTaskByID(c *gin.Context) {
	taskIDStr := c.Param("id")
	taskID, err := strconv.Atoi(taskIDStr)

	if err != nil {
		return
	}

	task := tc.tm.GetTaskById(taskID)

	c.IndentedJSON(http.StatusFound, task)
}

func (tc *tasksController) createNewTask(c *gin.Context) {
	var taskDTO NewTaskDTO
	if err := c.BindJSON(&taskDTO); err != nil {
		return
	}
	newTask := tc.tm.CreateTask(taskDTO.Points, taskDTO.Title, taskDTO.AssigneeID)

	c.IndentedJSON(http.StatusCreated, newTask)
}
