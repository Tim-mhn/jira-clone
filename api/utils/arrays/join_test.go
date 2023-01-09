package arrays

import (
	"testing"
)

func TestJoinWithInts(t *testing.T) {
	var nums = []int{2, 3, 5}

	joined := Join(nums, ",")

	expectedResult := "2,3,5"
	if joined != expectedResult {
		t.Logf(`error. Expected %s. Instead got %s`, expectedResult, joined)
		t.Fail()
	}

}
