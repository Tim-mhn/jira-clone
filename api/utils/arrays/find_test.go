package arrays

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFind(t *testing.T) {

	t.Run("it should return the correct element matching the predicate function", func(t *testing.T) {

		numbers := []int{1, 3, 4, 2}

		target := 3

		res, _ := Find(numbers, func(n int) bool {
			return n == target
		})

		assert.Equal(t, target, res, "expected to find number 3")
	})

	t.Run("it should return true as the second argument if the element is found", func(t *testing.T) {

		numbers := []int{1, 3, 4, 2}

		target := 3

		_, found := Find(numbers, func(n int) bool {
			return n == target
		})

		assert.True(t, found)
	})

	t.Run("it should return false as the second argument if the element is not found", func(t *testing.T) {

		numbers := []int{1, 3, 4, 2}

		target := 15

		_, found := Find(numbers, func(n int) bool {
			return n == target
		})

		assert.False(t, found)
	})

	t.Run("it should work with structs", func(t *testing.T) {

		arr := []_TestStruct{
			{
				name: "bob",
				id:   1,
			},
			{
				name: "mike",
				id:   2,
			},
			{
				name: "tom",
				id:   3,
			},
		}

		el, _ := Find(arr, func(s _TestStruct) bool {
			return s.name == "tom"
		})

		assert.Equal(t, "tom", el.name)
	})
}

type _TestStruct struct {
	name string
	id   int
}
