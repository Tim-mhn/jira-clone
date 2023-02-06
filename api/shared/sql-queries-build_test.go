package shared

import (
	"fmt"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

func TestBuildSQLUpdateQuery(t *testing.T) {

	t.Run("should return an UPDATE query builder on the given table name ", func(t *testing.T) {

		db, mock, _ := sqlmock.New()
		var fieldsToUpdate map[string]interface{} = map[string]interface{}{
			"name": "new project name",
		}

		var apiToDBFieldMap map[string]string = map[string]string{
			"name": "name",
		}

		var condition SQLCondition = SQLCondition{
			Field: "some field",
			Value: "hey",
		}

		var tableName = "project"

		queryBuilder := BuildSQLUpdateQuery(tableName, fieldsToUpdate, apiToDBFieldMap, condition)

		mock.ExpectExec("UPDATE project").WillReturnResult(sqlmock.NewResult(1, 1))
		_, err := queryBuilder.RunWith(db).Exec()

		assert.Nil(t, err)

		expectationsError := mock.ExpectationsWereMet()

		var errorMessage string
		if expectationsError != nil {
			errorMessage = expectationsError.Error()
		}
		assert.Nil(t, expectationsError, errorMessage)

	})

	t.Run("should update all the fields which have been passed ", func(t *testing.T) {

		db, mock, _ := sqlmock.New()
		var fieldsToUpdate map[string]interface{} = map[string]interface{}{
			"Name":      "project new name",
			"Completed": false,
		}

		var apiToDBFieldMap map[string]string = map[string]string{
			"Name":      "name",
			"Completed": "completed",
		}

		var condition SQLCondition = SQLCondition{
			Field: "some field",
			Value: "hey",
		}

		var tableName = "project"

		queryBuilder := BuildSQLUpdateQuery(tableName, fieldsToUpdate, apiToDBFieldMap, condition)
		queryRegex := regexp.MustCompile("^UPDATE project SET (name.*completed.*|completed.*name.*)")

		mock.ExpectExec(queryRegex.String()).WillReturnResult(sqlmock.NewResult(1, 1))
		_, err := queryBuilder.RunWith(db).Exec()

		assert.Nil(t, err)

		expectationsError := mock.ExpectationsWereMet()

		var errorMessage string
		if expectationsError != nil {
			errorMessage = expectationsError.Error()
		}
		assert.Nil(t, expectationsError, fmt.Sprintf("Expecting to run SQL query to update 'name', 'completed' and 'membersCount' fields. \nDetails: %s", errorMessage))

	})

	t.Run("should use the field names from the apiToDBfieldMap in the query", func(t *testing.T) {

		db, mock, _ := sqlmock.New()

		var fieldsToUpdate map[string]interface{} = map[string]interface{}{
			"Name": "project new name",
		}

		var apiToDBFieldMap map[string]string = map[string]string{
			"Name":      "project_name",
			"Completed": "completed",
		}

		var condition SQLCondition = SQLCondition{
			Field: "some field",
			Value: "hey",
		}

		query := BuildSQLUpdateQuery("project", fieldsToUpdate, apiToDBFieldMap, condition)

		sql, args, _ := query.ToSql()

		mock.ExpectExec("UPDATE project SET project_name")

		query.RunWith(db).Exec()

		assert.Nil(t, mock.ExpectationsWereMet(), fmt.Sprintf("should use 'project_name' in the SQL Query\nSQL: %s\nArgs: %s", sql, args))
	})

	t.Run("should update the given fields with the correct values", func(t *testing.T) {

		db, mock, _ := sqlmock.New()
		var fieldsToUpdate map[string]interface{} = map[string]interface{}{
			"Name":      "project new name",
			"Completed": false,
		}

		var apiToDBFieldMap map[string]string = map[string]string{
			"Name":      "name",
			"Completed": "completed",
		}

		var condition SQLCondition = SQLCondition{
			Field: "some field",
			Value: "hey",
		}

		var tableName = "project"

		queryBuilder := BuildSQLUpdateQuery(tableName, fieldsToUpdate, apiToDBFieldMap, condition)

		sql, _, _ := queryBuilder.ToSql()
		queryRegex := regexp.MustCompile("^UPDATE project SET (name.*completed.*|completed.*name.*)")

		unorderedArgs := tests_utils.MatchSQLUnorderedArgs{ArgValues: map[string]interface{}{
			"name":      fieldsToUpdate["Name"],
			"completed": fieldsToUpdate["Completed"],
		},
		}
		mock.
			ExpectExec(queryRegex.String()).
			WithArgs(unorderedArgs, unorderedArgs, sqlmock.AnyArg()).
			WillReturnResult(sqlmock.NewResult(1, 1))
		_, err := queryBuilder.RunWith(db).Exec()

		assert.Nil(t, err)

		expectationsError := mock.ExpectationsWereMet()

		var errorMessage string
		if expectationsError != nil {
			errorMessage = expectationsError.Error()
		}
		assert.Nil(t, expectationsError, fmt.Sprintf("Expecting to run SQL query to update name, completed and members_count with the right arguments \nSQL: %s\nDetails: %s", sql, errorMessage))

	})

	t.Run("should use the nme from fieldsToUpdate if there are no matching DB field in apiToDBFieldMap", func(t *testing.T) {

		db, mock, _ := sqlmock.New()
		var fieldsToUpdate map[string]interface{} = map[string]interface{}{
			"name": "project new name",
		}

		var apiToDBFieldMap map[string]string = map[string]string{}

		var condition SQLCondition = SQLCondition{
			Field: "some field",
			Value: "hey",
		}

		var tableName = "project"

		queryBuilder := BuildSQLUpdateQuery(tableName, fieldsToUpdate, apiToDBFieldMap, condition)

		sql, _, _ := queryBuilder.ToSql()
		queryRegex := `^UPDATE project SET name = \$1`
		mock.
			ExpectExec(queryRegex).
			WillReturnResult(sqlmock.NewResult(1, 1))
		_, err := queryBuilder.RunWith(db).Exec()

		assert.Nil(t, err)

		expectationsError := mock.ExpectationsWereMet()

		var errorMessage string
		if expectationsError != nil {
			errorMessage = expectationsError.Error()
		}
		assert.Nil(t, expectationsError,
			fmt.Sprintf(`Should use the name field even if apiToDBFieldMap is empty \n`+
				`SQL Query: %s\n`+
				`Details: %s`, sql, errorMessage))

	})

	t.Run("should run the DB Query with the correct WHERE clause", func(t *testing.T) {
		db, mock, _ := sqlmock.New()

		var fieldsToUpdate map[string]interface{} = map[string]interface{}{
			"name": "project new name",
		}

		var apiToDBFieldMap map[string]string = map[string]string{}

		projectId := "some-id"

		var condition SQLCondition = SQLCondition{
			Field: "id",
			Value: projectId,
		}

		query := BuildSQLUpdateQuery("project", fieldsToUpdate, apiToDBFieldMap, condition)

		sql, args, _ := query.ToSql()
		mock.ExpectExec("UPDATE.*").WithArgs(sqlmock.AnyArg(), projectId)
		query.RunWith(db).Exec()

		assert.Nil(t, mock.ExpectationsWereMet(), fmt.Sprintf("Query is missing the correct WHERE clause.\nSQL Query: %s.\nArgs: %s", sql, args))

	})

	t.Run("it should accept a struct as fieldsToUpdate input", func(t *testing.T) {

		db, mock, _ := sqlmock.New()
		var pointsPtr *int = new(int)
		*pointsPtr = 4
		patch := _ExamplePatch{
			Points: pointsPtr,
		}

		query := BuildSQLUpdateQuery("project", patch, map[string]string{}, SQLCondition{
			Field: "id",
			Value: "some-id",
		})

		sql, args, _ := query.ToSql()

		mock.ExpectExec("UPDATE project SET points").WithArgs(sqlmock.AnyArg(), sqlmock.AnyArg())
		query.RunWith(db).Exec()

		assert.Nil(t, mock.ExpectationsWereMet(), fmt.Sprintf("SQL Query: %s\nArgs: %s", sql, args))

	})
}

type _ExamplePatch struct {
	Name   *string `json:"name,omitempty"`
	Points *int    `json:"points,omitempty"`
}
