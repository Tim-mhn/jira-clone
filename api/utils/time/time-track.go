package time_utils

import (
	"log"
	"time"
)

func LogFunctionTime(start time.Time, functionName string) {
	elapsed := time.Since(start)
	log.Printf("\n%s took %s\n", functionName, elapsed)
}
