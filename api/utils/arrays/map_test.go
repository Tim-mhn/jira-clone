package arrays

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMapArray(t *testing.T) {
	var nums = []int{2, 3, 5}

	var doubles = MapArray(nums, func(i int) int {
		return i * 2
	})

	assert.Equal(t, doubles[0], 4, fmt.Sprintf(`%d should be equal to 4`, doubles[0]))
	assert.Equal(t, doubles[1], 6, fmt.Sprintf(`%d should be equal to 6`, doubles[1]))
	assert.Equal(t, doubles[2], 10, fmt.Sprintf(`%d should be equal to 10`, doubles[2]))

}

func TestMapStringsToInts(t *testing.T) {
	var strings = []string{"3", "5", "1"}

	var ints = MapStringsToInts(strings)

	var expectedArray = []int{3, 5, 1}
	assert.EqualValues(t, expectedArray, ints)
}
