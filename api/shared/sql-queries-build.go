package shared

import (
	"encoding/json"
	"fmt"
	"log"
	"reflect"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
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

func BuildSQLUpdateQuery(tableName string, fieldsToUpdate interface{}, apiToDBFieldMap map[string]string, condition SQLCondition) sq.UpdateBuilder {
	log.Printf(`[BuildSQLUpdateQuery] starting with condition: Field=%s -- Value=%s`, condition.Field, condition.Value)

	psql := database.GetPsqlQueryBuilder()

	queryBuilder := psql.Update(tableName)

	fieldsValuesMap := convertStructToMap(fieldsToUpdate)
	for field, value := range fieldsValuesMap {
		dbField, ok := apiToDBFieldMap[field]
		if !ok {
			dbField = field
		}

		correctValue := value
		kind := reflect.ValueOf(value).Kind()
		fmt.Print(kind)
		isPointer := reflect.ValueOf(value).Kind() == reflect.Ptr

		if isPointer {
			correctValue = *(value.(*interface{}))
		}
		queryBuilder = queryBuilder.Set(dbField, correctValue)
	}

	queryBuilder = queryBuilder.Where(sq.Eq{
		condition.Field: condition.Value,
	})

	return queryBuilder

}

func convertStructToMap(fieldsToUpdate interface{}) map[string]interface{} {
	bytes, err := json.Marshal(&fieldsToUpdate)

	if err != nil {
		print(err)
	}
	var jsonMap map[string]interface{}
	err = json.Unmarshal(bytes, &jsonMap)
	print(err)
	return jsonMap
}
