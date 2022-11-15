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
	Points int `json:"points"`
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
		taskDTO := decodeBody(r)
		newTask := tc.tm.CreateTask(taskDTO.Points)
		encodeResponseAsJson(newTask, w)
	default:
		w.WriteHeader(http.StatusNotImplemented)
	}
}

func newTasksController() *tasksController {
	return &tasksController{
		tm:            db.NewTaskManager(),
		taskIDPattern: regexp.MustCompile(`^/tasks/(\d+)`),
	}
}

func encodeResponseAsJson(data interface{}, w io.Writer) {
	enc := json.NewEncoder(w)
	enc.Encode(data)
}

func decodeBody(r *http.Request) *NewTaskDTO {
	var taskDTO NewTaskDTO
	json.NewDecoder(r.Body).Decode(&taskDTO)
	return &taskDTO
}
