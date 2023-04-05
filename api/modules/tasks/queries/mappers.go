package tasks_queries

import (
	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/sprints"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

func buildTaskFromPersistenceData(taskPersistence TaskPersistenceModel) tasks_models.Task {
	taskKey := buildTaskKey(taskPersistence.project_key, taskPersistence.task_number)

	assignee := auth.BuildUserWithIcon(taskPersistence.assignee_id, taskPersistence.assignee_name, taskPersistence.assignee_email)
	title := tags.RemoveTagsFromTaskTitle(taskPersistence.rawTitle)

	tags := tags.ExtractTagsFromHTMLTitle(taskPersistence.rawTitle)

	return tasks_models.Task{
		Id:          &taskPersistence.id,
		Description: &taskPersistence.description,
		Title:       &title,
		RawTitle:    &taskPersistence.rawTitle,
		Points:      taskPersistence.points,
		Key:         &taskKey,
		Type:        taskPersistence.Type,
		Assignee:    assignee,
		Status:      taskPersistence.status,
		Tags:        tags,
		Sprint: sprints.SprintIdName{
			Name: taskPersistence.sprint_name,
			Id:   taskPersistence.sprint_id,
		},
	}
}

func BuildTaskInfoFromPersistenceData(taskInfoPersistence TaskInfoPersistenceModel) tasks_models.TaskInfo {
	taskKey := buildTaskKey(taskInfoPersistence.Project_key, taskInfoPersistence.Task_number)
	title := tags.RemoveTagsFromTaskTitle(taskInfoPersistence.Raw_title)

	project := tasks_models.ProjectInfo{
		Id:   taskInfoPersistence.Project_id,
		Name: taskInfoPersistence.Project_name,
	}
	return tasks_models.TaskInfo{
		Points:      taskInfoPersistence.Points,
		Id:          taskInfoPersistence.Id,
		Title:       title,
		Description: taskInfoPersistence.Description,
		Key:         taskKey,
		Project:     project,
	}

}
