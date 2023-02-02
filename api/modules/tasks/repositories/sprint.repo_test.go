package tasks_repositories

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
)

func TestUpdateSprint(t *testing.T) {

	t.Run("should return a SprintNotFound error if no rows were affected", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		noRowsAffectedResult := sqlmock.NewResult(1, 0)

		mock.ExpectExec("UPDATE").WillReturnResult(noRowsAffectedResult)

		sprintID := "sprint-id"
		newSprintName := "some new name"
		err := repo.UpdateSprint(sprintID, newSprintName)

		assert.Equal(t, tasks_errors.SprintNotFound, err.Code)
	})

}
