package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"

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

func (tc tasksController) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	matches := tc.taskIDPattern.FindStringSubmatch(r.URL.Path)
	isSingleTaskRoute := len(matches) > 0

	switch r.Method {
	case http.MethodGet:
		if isSingleTaskRoute {
			fmt.Println("calling single task route")
			taskID, _ := strconv.Atoi(matches[1])
			task := tc.tm.GetTaskById(taskID)
			encodeResponseAsJson(task, w)
		} else {
			tasks := tc.tm.GetAllTasks()
			encodeResponseAsJson(tasks, w)
		}

	case http.MethodPost:
		var taskDTO NewTaskDTO
		DecodeBody(r, &taskDTO)
		newTask := tc.tm.CreateTask(taskDTO.Points, taskDTO.Title, taskDTO.AssigneeID)
		encodeResponseAsJson(newTask, w)
	default:
		w.WriteHeader(http.StatusNotImplemented)
	}
}

func newTasksController(um *db.UserManager) *tasksController {
	return &tasksController{
		tm:            db.NewTaskManager(um),
		taskIDPattern: regexp.MustCompile(`^/tasks/(\d+)`),
	}
}

func encodeResponseAsJson(data interface{}, w io.Writer) {
	enc := json.NewEncoder(w)
	enc.Encode(data)
}
