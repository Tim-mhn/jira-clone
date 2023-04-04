package tasks_queries

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

func TestRepoGetTaskByID(t *testing.T) {

	TASK_ID := "task-id-123"
	task := TaskPersistenceModel{
		id:          TASK_ID,
		rawTitle:    "A raw title",
		points:      3,
		description: "description",
		status: tasks_models.TaskStatus{
			Id:    1,
			Label: "New",
			Color: "Primary",
		},
		assignee_id:    "assignee-id-123-xyz",
		assignee_name:  "Bob Cook",
		assignee_email: "bob.cook@mail.com",
		project_key:    "WP",
		task_number:    13,
		sprint_id:      "sprint-id-123-xyz",
		sprint_name:    "sprint 123",
	}
	t.Run("it should correctly build the Persistence Model with the DB results", func(t *testing.T) {
		db, mock, _ := sqlmock.New()
		repo := NewTaskQueriesRepository(db)

		rows := buildMockRowsFromTestData([]TaskPersistenceModel{task})
		mock.ExpectQuery("SELECT").WillReturnRows(rows)

		taskResult, _ := repo.GetTaskByID(TASK_ID)

		assert.EqualValues(t, task, taskResult)

	})

	t.Run("it should return a TaskNotFound error if there are no rows returned by the DB", func(t *testing.T) {
		db, mock, _ := sqlmock.New()
		repo := NewTaskQueriesRepository(db)

		emptyRows := buildEmptyRows()

		mock.ExpectQuery("SELECT").WillReturnRows(emptyRows)

		_, err := repo.GetTaskByID(TASK_ID)

		assert.NotNil(t, err)
		assert.EqualValues(t, tasks_errors.TaskNotFound, err.Code)

	})

}

func TestGetSprintTasks(t *testing.T) {

	sprintId := "sprint-id-123"

	task1 := TaskPersistenceModel{
		id:          "task-1",
		rawTitle:    "A raw title",
		points:      3,
		description: "description",
		status: tasks_models.TaskStatus{
			Id:    1,
			Label: "New",
			Color: "Primary",
		},
		assignee_id:    "assignee-id-123-xyz",
		assignee_name:  "Bob Cook",
		assignee_email: "bob.cook@mail.com",
		project_key:    "WP",
		task_number:    13,
		sprint_id:      sprintId,
	}

	task2 := TaskPersistenceModel{
		id:          "task-1",
		rawTitle:    "A raw title",
		points:      3,
		description: "description",
		status: tasks_models.TaskStatus{
			Id:    1,
			Label: "New",
			Color: "Primary",
		},
		assignee_id:    "assignee-id-123-xyz",
		assignee_name:  "Bob Cook",
		assignee_email: "bob.cook@mail.com",
		project_key:    "WP",
		task_number:    13,
		sprint_id:      sprintId,
	}

	tasks := []TaskPersistenceModel{task1, task2}

	t.Run("should run a WHERE condition on the sprint id", func(t *testing.T) {
		db, mock, _ := sqlmock.New()
		repo := NewTaskQueriesRepository(db)

		rows := buildMockRowsFromTestData(tasks)

		mock.ExpectQuery("SELECT(.*)WHERE sprint_id(.*)").WillReturnRows(rows)

		repo.GetSprintTasks(sprintId, tasks_models.TaskFilters{})

		err := mock.ExpectationsWereMet()

		assert.Nil(t, err)

	})

	t.Run("should correctly map the DB results", func(t *testing.T) {
		db, mock, _ := sqlmock.New()
		repo := NewTaskQueriesRepository(db)

		rows := buildMockRowsFromTestData(tasks)

		mock.ExpectQuery("SELECT(.*)").WillReturnRows(rows)

		tasksResult, _ := repo.GetSprintTasks(sprintId, tasks_models.TaskFilters{})

		expectedTasks := tasks
		assert.EqualValues(t, expectedTasks, tasksResult)

	})
}

func buildEmptyRows() *sqlmock.Rows {
	return sqlmock.NewRows([]string{
		"task_id", "title", "points", "description",
		"task_status", "task_status_label", "task_status_color",
		"assignee_id", "user_name", "user_email",
		"task_type_id", "task_type_label", "task_type_color", "task_type_icon",
		"sprint_id", "sprint_name",
		"project_key", "task_number",
	})
}
func buildMockRowsFromTestData(tasks []TaskPersistenceModel) *sqlmock.Rows {
	rows := buildEmptyRows()

	for _, task := range tasks {
		rows = rows.AddRow(
			task.id, task.rawTitle, task.points, task.description,
			task.status.Id, task.status.Label, task.status.Color,
			task.assignee_id, task.assignee_name, task.assignee_email,
			task.Type.Id, task.Type.Label, task.Type.Color, task.Type.Icon,
			task.sprint_id, task.sprint_name,
			task.project_key, task.task_number)
	}

	return rows
}
