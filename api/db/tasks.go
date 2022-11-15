package db

import (
	"github.com/tim-mhn/figma-clone/models"
)

type TaskManager struct {
	lastTaskID int
	tasks      []models.Task
	um         *UserManager
	pm         *ProjectManager
}

func NewTaskManager(um *UserManager, pm *ProjectManager) *TaskManager {
	tm := TaskManager{}
	tm.um = um
	tm.pm = pm
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

func (tm *TaskManager) CreateTask(points int, title string, assigneeID int, projectID int) (models.Task, error) {
	newTaskID := tm.lastTaskID + 1
	userAssigned, getUserErr := tm.um.GetUserByID(assigneeID)
	if getUserErr != nil {
		return models.Task{}, getUserErr
	}

	project, getProjectErr := tm.pm.getProjectByID(projectID)

	if getProjectErr != nil {
		return models.Task{}, getProjectErr
	}
	newTask := models.Task{
		Id:       newTaskID,
		Points:   points,
		Title:    title,
		Assignee: userAssigned,
		Status:   models.New,
		Project:  project,
	}
	tm.incrementTaskID()
	tm.saveTask(newTask)
	return newTask, nil
}
