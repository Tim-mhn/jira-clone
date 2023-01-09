package dtos

import "github.com/tim-mhn/figma-clone/models"

type SprintWithTasks struct {
	Tasks  []models.Task
	Sprint models.Sprint
}

type SprintListWithTasksDTO = []SprintWithTasks
