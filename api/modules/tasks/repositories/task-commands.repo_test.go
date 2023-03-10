package tasks_repositories

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
)

func TestUpdateTaskData(t *testing.T) {
	t.Run("it should use the 'assignee_id' field in the SQL Query", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := new(SQLTaskCommandsRepository)
		repo.conn = db

		taskID := "id-of-task-1234"
		var newAssigneeIDPtr *string = new(string)
		*newAssigneeIDPtr = "assignee-id-azerty"

		dto := tasks_dtos.PatchTaskDTO{
			AssigneeId: newAssigneeIDPtr,
		}

		mock.ExpectExec("UPDATE task SET assignee_id").WillReturnResult(sqlmock.NewResult(1, 1))

		repo.UpdateTaskData(taskID, dto)

		assert.Nil(t, mock.ExpectationsWereMet(), "SQL Query did not use correct assignee_id field")
	})
}
