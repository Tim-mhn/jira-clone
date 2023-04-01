package arrays

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReduce(t *testing.T) {

	t.Run("it should successfully make the sum of an int array", func(t *testing.T) {
		numbers := []int{1, 3, 3, 5}

		sum := func(a int, b int) int {
			return a + b
		}
		summed := Reduce(numbers, sum, 0)

		assert.Equal(t, 12, summed)
	})

	t.Run("it should successfully make the sum of an int array with a non-0 initial value", func(t *testing.T) {
		numbers := []int{1, 3, 3, 5}

		sum := func(a int, b int) int {
			return a + b
		}
		summed := Reduce(numbers, sum, 8)

		assert.Equal(t, 20, summed)
	})
}
