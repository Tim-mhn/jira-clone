package tests_utils

import (
	"database/sql/driver"
	"time"
)

type ArgValues = map[string]interface{}

type MatchSQLUnorderedArgs struct {
	ArgValues
}

func (verifyUnorderedArgs MatchSQLUnorderedArgs) Match(v driver.Value) bool {
	dbStringValue, strOk := v.(string)
	dbBoolValue, boolOk := v.(bool)
	dbIntValue, intOk := v.(int)

	for _, value := range verifyUnorderedArgs.ArgValues {
		valueAsString, ok := value.(string)
		if ok && strOk && dbStringValue == valueAsString {
			return true
		}

		valueAsBool, ok := value.(bool)
		if ok && boolOk && dbBoolValue == valueAsBool {
			return true
		}

		valueAsInt, ok := value.(int)
		if ok && intOk && dbIntValue == valueAsInt {
			return true
		}

		valueAsTime, ok := value.(time.Time)
		if ok && strOk {
			const layout = "2006-01-02T15:04:05-07:00"
			dbTime, _ := time.Parse(layout, dbStringValue)
			return dbTime.Equal(valueAsTime)
		}

	}

	return false
}
