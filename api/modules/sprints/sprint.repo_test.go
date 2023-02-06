package sprints

import (
	"database/sql"
	"fmt"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/tim-mhn/figma-clone/utils/primitives"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

func TestUpdateSprint(t *testing.T) {

	t.Run("should return a SprintNotFound error if no rows were affected", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		noRowsAffectedResult := sqlmock.NewResult(1, 0)

		mock.ExpectExec("UPDATE").WillReturnResult(noRowsAffectedResult)

		sprintID := "sprint-id"

		updateSprint := _UpdateSprint{
			Name: primitives.CreateStringPointer("some new name"),
		}

		err := repo.UpdateSprint(sprintID, updateSprint)

		assert.Equal(t, SprintNotFound, err.Code)
	})

	t.Run("should update start/end dates if they are passed", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		var startDate *time.Time = new(time.Time)
		*startDate = time.Date(2022, 12, 10, 0, 0, 0, 0, time.UTC)
		var endDate *time.Time = new(time.Time)
		*endDate = time.Date(2024, 12, 10, 0, 0, 0, 0, time.UTC)

		newName := "some new name"
		updateSprint := _UpdateSprint{
			Name:      primitives.CreateStringPointer(newName),
			StartDate: startDate,
			EndDate:   endDate,
		}

		sprintID := "sprint-id"

		unorderedArgs := tests_utils.MatchSQLUnorderedArgs{
			ArgValues: map[string]interface{}{
				"name":       newName,
				"start_date": "2022-12-10T00:00:00Z",
				"end_date":   "2024-12-10T00:00:00Z",
			},
		}

		mock.ExpectExec("UPDATE sprint ").
			WithArgs(unorderedArgs, unorderedArgs, unorderedArgs, sprintID)

		repo.UpdateSprint(sprintID, updateSprint)

		expectationsError := mock.ExpectationsWereMet()
		var errorMessage string
		if expectationsError != nil {
			errorMessage = expectationsError.Error()
		}
		assert.Nil(t, expectationsError, fmt.Sprintf("Expectations were not met. Repo should run SQL query with sprint's new date, start date and end date. \nDetails: %s", errorMessage))
	})

	t.Run("should not update start/end dates if they are nil", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		newName := "some new name"
		updateSprint := _UpdateSprint{
			Name: primitives.CreateStringPointer(newName),
		}

		sprintID := "sprint-id"

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE sprint`)).
			WithArgs(newName, sprintID)

		repo.UpdateSprint(sprintID, updateSprint)

		expectationsError := mock.ExpectationsWereMet()
		var errorMessage string
		if expectationsError != nil {
			errorMessage = expectationsError.Error()
		}
		assert.Nil(t, expectationsError, fmt.Sprintf("Expectations were not met. Repo should run SQL query with only sprint's new name and ID as args. \nDetails: %s", errorMessage))
	})

	t.Run("use the right DB fields in the query for start/end dates", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		var startDate *time.Time = new(time.Time)
		*startDate = time.Date(2024, 12, 10, 0, 0, 0, 0, time.Local)
		var endDate *time.Time = new(time.Time)
		*endDate = time.Date(2024, 12, 10, 0, 0, 0, 0, time.Local)

		updateSprint := _UpdateSprint{
			StartDate: startDate,
			EndDate:   endDate,
		}

		sprintID := "sprint-id"

		mock.ExpectExec("UPDATE sprint SET (start_date.*|end_date.*){2}")

		repo.UpdateSprint(sprintID, updateSprint)

		expectationsError := mock.ExpectationsWereMet()
		var errorMessage string
		if expectationsError != nil {
			errorMessage = expectationsError.Error()
		}
		assert.Nil(t, expectationsError, fmt.Sprintf("Should use 'start_date' in the DB query \nDetails: %s", errorMessage))
	})
}

func TestGetActiveSprintsOfProject(t *testing.T) {

	t.Run("it should correctly map the start/end dates returned by the DB query", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		startDate := time.Date(2020, 12, 1, 4, 0, 0, 0, time.Local)
		endDate := time.Date(2020, 12, 15, 4, 0, 0, 0, time.Local)
		createdOn := time.Date(2020, 10, 1, 4, 0, 0, 0, time.Local)

		rows := sqlmock.NewRows([]string{"id", "name", "is_backlog", "created_on", "start_date", "end_date"}).
			AddRow("sprint-id", "My Sprint", false, createdOn, startDate, endDate)

		mock.ExpectQuery("^SELECT.*").WillReturnRows(rows)

		sprints, err := repo.GetActiveSprintsOfProject("cec")

		assert.Nil(t, err)
		assert.EqualValues(t, startDate, *sprints[0].StartDate)
		assert.EqualValues(t, endDate, *sprints[0].EndDate)

	})

	t.Run("it should handle null values for start/end dates returned by the DB query", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		createdOn := time.Date(2020, 10, 1, 4, 0, 0, 0, time.Local)

		rows := sqlmock.NewRows([]string{"id", "name", "is_backlog", "created_on", "start_date", "end_date"}).
			AddRow("sprint-id", "My Sprint", false, createdOn, sql.NullTime{}, sql.NullTime{})

		mock.ExpectQuery("^SELECT.*").WillReturnRows(rows)

		sprints, err := repo.GetActiveSprintsOfProject("cec")

		ok := assert.Nil(t, err)
		if ok {
			assert.Nil(t, sprints[0].StartDate)
			assert.Nil(t, sprints[0].EndDate)
		}

	})
}

func TestGetSprintInfo(t *testing.T) {
	t.Run("it should correctly map the start/end dates returned by the DB query", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		startDate := time.Date(2020, 12, 1, 4, 0, 0, 0, time.Local)
		endDate := time.Date(2020, 12, 15, 4, 0, 0, 0, time.Local)
		createdOn := time.Date(2020, 10, 1, 4, 0, 0, 0, time.Local)

		rows := sqlmock.NewRows([]string{"id", "name", "is_backlog", "created_on", "start_date", "end_date"}).
			AddRow("sprint-id", "My Sprint", false, createdOn, startDate, endDate)

		mock.ExpectQuery("^SELECT.*").WillReturnRows(rows)

		sprint, err := repo.GetSprintInfo("sprint-id")

		assert.EqualValues(t, false, err.HasError)
		assert.EqualValues(t, startDate, *sprint.StartDate)
		assert.EqualValues(t, endDate, *sprint.EndDate)

	})

	t.Run("it should handle null values for start/end dates returned by the DB query", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		repo := NewSprintRepository(db)

		createdOn := time.Date(2020, 10, 1, 4, 0, 0, 0, time.Local)

		rows := sqlmock.NewRows([]string{"id", "name", "is_backlog", "created_on", "start_date", "end_date"}).
			AddRow("sprint-id", "My Sprint", false, createdOn, sql.NullTime{}, sql.NullTime{})

		mock.ExpectQuery("^SELECT.*").WillReturnRows(rows)

		sprint, err := repo.GetSprintInfo("sprint-id")

		ok := assert.EqualValues(t, false, err.HasError)
		if ok {
			assert.Nil(t, sprint.StartDate)
			assert.Nil(t, sprint.EndDate)
		}

	})
}
