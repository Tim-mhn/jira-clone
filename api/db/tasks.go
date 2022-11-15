package db

import "github.com/tim-mhn/figma-clone/models"

type TaskManager struct {
	lastTaskID int
	tasks      []models.Task
}

func NewTaskManager() *TaskManager {
	tm := TaskManager{}

	tm.tasks = []models.Task{}
	tm.lastTaskID = 0

	return &tm
}

func (tm *TaskManager) incrementTaskID() {
	tm.lastTaskID++
}

func (tm TaskManager) GetAllTasks() []models.Task {
	return tm.tasks

}

func (tm *TaskManager) GetTaskById(id int) *models.Task {
	for _, t := range tm.tasks {
		if t.Id == id {
			return &t
		}
	}

	return nil
}

func (tm *TaskManager) saveTask(t models.Task) {
	tm.tasks = append(tm.tasks, t)
}

func (tm *TaskManager) CreateTask(points int) models.Task {
	newTaskID := tm.lastTaskID + 1
	newTask := models.Task{
		Id:     newTaskID,
		Points: points,
	}
	tm.incrementTaskID()
	tm.saveTask(newTask)
	return newTask
}
