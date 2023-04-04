package tasks_repositories

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	"github.com/tim-mhn/figma-clone/utils/primitives"
)

func TestGetTaskByID(t *testing.T) {

	db, mock, _ := sqlmock.New()
	repo := NewTaskQueriesRepository(db)

	task := new(tasks_models.TaskWithSprint)
	dbRawTitle := tags.BuildTitleWithTags(tags.TaskTitleParts{
		{
			Text:  "Hello",
			IsTag: false,
		},
		{
			Text:  "world",
			IsTag: true,
		},
		{
			Text:  "!!!",
			IsTag: false,
		},
	})

	task.Task.RawTitle = primitives.CreateStringPointer(dbRawTitle)

	dbRows := buildMockRowsFromTestData(*task)

	mock.ExpectQuery("SELECT").WillReturnRows(dbRows)

	repoTaskOutput, _ := repo.GetTaskByID("task-id")

	t.Run("it should correctly return the rawTitle from the DB result", func(t *testing.T) {
		expectedRawTitle := dbRawTitle
		assert.EqualValues(t, expectedRawTitle, *repoTaskOutput.RawTitle)

	})

	t.Run("should correctly build the Title by removing the tags from the RawTitle", func(t *testing.T) {
		expectedTitle := tags.RemoveTagsFromTaskTitle(dbRawTitle)
		assert.EqualValues(t, expectedTitle, *repoTaskOutput.Title)

	})

	t.Run("Title and RawTitle should be equal if there are no tags in the RawTitle", func(t *testing.T) {
		otherTask := *task
		otherTask.RawTitle = primitives.CreateStringPointer("This task title does not contain tags")

		dbRows := buildMockRowsFromTestData(otherTask)

		mock.ExpectQuery("SELECT").WillReturnRows(dbRows)

		repoTaskOutput, _ := repo.GetTaskByID("some id")

		assert.EqualValues(t, *repoTaskOutput.Title, *repoTaskOutput.RawTitle)

	})

	t.Run("should correctly set the Tags field by extracting the tags from the title", func(t *testing.T) {
		tags := repoTaskOutput.Tags
		expectedTags := []string{"world"}
		assert.EqualValues(t, expectedTags, tags)
	})
}

func buildMockRowsFromTestData(taskWithSprint tasks_models.TaskWithSprint) *sqlmock.Rows {
	rows := sqlmock.NewRows([]string{
		"task_id", "title", "points", "description",
		"task_status", "task_status_label", "task_status_color",
		"assignee_id", "user_name", "user_email", "task_key",
		"task_type_id", "task_type_label", "task_type_color", "task_type_icon",
		"sprint_name", "sprint_id", "sprint_backlog",
	})

	task := taskWithSprint.Task
	sprint := taskWithSprint.Sprint
	rows = rows.AddRow(
		task.Id, task.RawTitle, task.Points, task.Description,
		task.Status.Id, task.Status.Label, task.Status.Color,
		task.Assignee.Id, task.Assignee.Name, task.Assignee.Email, task.Key,
		task.Type.Id, task.Type.Label, task.Type.Color, task.Type.Icon,
		sprint.Name, sprint.Id, sprint.IsBacklog)

	return rows
}
