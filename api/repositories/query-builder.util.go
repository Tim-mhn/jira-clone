package repositories

import (
	"fmt"
	"reflect"
)

type FieldValuesToUpdate struct {
	fields []string
	values []any
}

type SQLCondition struct {
	field string
	value string
}

func buildFieldValuesToUpdate(input interface{}) FieldValuesToUpdate {

	var fields []string
	var args []any
	inputFields := reflect.TypeOf(input)

	values := reflect.ValueOf(input)

	num := inputFields.NumField()

	for i := 0; i < num; i++ {
		fType := inputFields.Field(i)
		fVal := values.Field(i)

		if fVal.IsNil() {
			continue
		}

		var val reflect.Value
		if fVal.Kind() == reflect.Ptr {
			val = fVal.Elem()
		} else {
			val = fVal
		}

		name := fType.Name

		fields = append(fields, name)

		kind := val.Kind()
		switch kind {
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			args = append(args, fmt.Sprintf(`%d`, val.Int()))

		case reflect.String:
			args = append(args, fmt.Sprintf(`'%s'`, val.String()))

		case reflect.Bool:
			if val.Bool() {
				args = append(args, 1)
			} else {
				args = append(args, 0)
			}
		}

	}

	return FieldValuesToUpdate{
		fields: fields,
		values: args,
	}

}

func buildSQLUpdateQuery(input interface{}, apiToDBFieldMap map[string]string, condition SQLCondition) string {
	sqlUpdates := buildFieldValuesToUpdate(input)

	var dbFields []string

	for i := range sqlUpdates.fields {
		apiField := sqlUpdates.fields[i]
		dbFields = append(dbFields, apiToDBFieldMap[apiField])
	}

	var updateQuery = "UPDATE task SET "

	n := len(sqlUpdates.fields)

	for i := 0; i < n; i++ {
		dbField := dbFields[i]
		newValue := sqlUpdates.values[i]
		updateQuery += fmt.Sprintf(`%s=%s`, dbField, newValue)

		if i < n-1 {
			updateQuery += ","
		}
	}

	updateQuery += fmt.Sprintf(` WHERE %s=%s`, condition.field, condition.value)

	return updateQuery

}
