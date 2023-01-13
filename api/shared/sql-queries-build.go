package shared

import (
	"fmt"
	"log"
	"reflect"
)

type FieldValuesToUpdate struct {
	Fields []string
	Values []any
}

type SQLCondition struct {
	Field string
	Value string
}

func BuildFieldValuesToUpdate(FieldsToUpdate interface{}) FieldValuesToUpdate {

	var Fields []string
	var args []any
	inputFields := reflect.TypeOf(FieldsToUpdate)

	Values := reflect.ValueOf(FieldsToUpdate)

	num := inputFields.NumField()

	for i := 0; i < num; i++ {
		fType := inputFields.Field(i)
		fVal := Values.Field(i)

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

		Fields = append(Fields, name)

		kind := val.Kind()
		switch kind {
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			args = append(args, fmt.Sprintf(`%d`, val.Int()))

		case reflect.String:
			stringVal := val.String()
			args = append(args, stringNULLIfEmptyString(stringVal))

		case reflect.Bool:
			if val.Bool() {
				args = append(args, 1)
			} else {
				args = append(args, 0)
			}
		}

	}

	log.Printf(`[buildFieldValuesToUpdate] Fields=%s Args=%s`, Fields, args)

	return FieldValuesToUpdate{
		Fields: Fields,
		Values: args,
	}

}

func stringNULLIfEmptyString(strValue string) string {
	if strValue == "" {
		return "NULL"
	} else {
		return fmt.Sprintf(`'%s'`, strValue)
	}
}

func BuildSQLUpdateQuery(FieldsToUpdate interface{}, apiToDBFieldMap map[string]string, condition SQLCondition) string {
	log.Printf(`[BuildSQLUpdateQuery] starting with condition: Field=%s -- Value=%s`, condition.Field, condition.Value)
	sqlUpdates := BuildFieldValuesToUpdate(FieldsToUpdate)

	var dbFields []string

	for i := range sqlUpdates.Fields {
		apiField := sqlUpdates.Fields[i]
		dbFields = append(dbFields, apiToDBFieldMap[apiField])
	}

	var updateQuery = "UPDATE task SET "

	n := len(sqlUpdates.Fields)

	for i := 0; i < n; i++ {
		dbField := dbFields[i]
		newValue := sqlUpdates.Values[i]
		updateQuery += fmt.Sprintf(`%s=%s`, dbField, newValue)

		if i < n-1 {
			updateQuery += ","
		}
	}

	updateQuery += fmt.Sprintf(` WHERE %s=%s`, condition.Field, condition.Value)

	log.Printf(`[BuildSQLUpdateQuery] Result: %s`, updateQuery)
	return updateQuery

}
