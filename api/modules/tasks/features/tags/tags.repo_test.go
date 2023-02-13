package tags

import (
	"database/sql/driver"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

type _customStringArrValueConverter struct {
}

func (c _customStringArrValueConverter) ConvertValue(v any) (driver.Value, error) {

	stringList, ok := v.([]string)

	if !ok {
		return v, nil
	}

	joinedStrings := strings.Join(stringList, ",")
	return joinedStrings, nil
}

func TestUpdateTaskTags(t *testing.T) {

	c := new(_customStringArrValueConverter)
	customValueConverter := sqlmock.ValueConverterOption(c)
	db, mock, _ := sqlmock.New(customValueConverter)

	t.Run("it should insert a new row if there is no row with the given taskID", func(t *testing.T) {

		repo := newTagsRepository(db)
		noRowsAffectedResult := sqlmock.NewResult(1, 0)
		mock.ExpectExec("UPDATE").WillReturnResult(noRowsAffectedResult)

		mock.ExpectExec("INSERT")

		repo.UpdateTaskTags("", []string{"tag1", "tag2"})

		expectationsMetError := mock.ExpectationsWereMet()
		assert.Nil(t, expectationsMetError, "Expected insert statement to be called when update returns 0 affected rows")
	})

}
