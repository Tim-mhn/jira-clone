package arrays

import (
	"testing"
)

func TestMapArray(t *testing.T) {
	var nums = []int{2, 3, 5}

	var doubles = MapArray(nums, func(i int) int {
		return i * 2
	})

	testPassed := doubles[0] == 4 && doubles[1] == 6 && doubles[2] == 10

	if !testPassed {
		t.Logf(`error. Expected [4, 6, 10]. Got %d`, doubles)
		t.Fail()
	}
}
