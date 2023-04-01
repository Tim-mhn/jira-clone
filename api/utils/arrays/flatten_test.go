package arrays

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFlatten(t *testing.T) {

	t.Run("should successfully flatten a string array", func(t *testing.T) {
		stringNestedArray := [][]string{
			{
				"hello", "sir",
			},
			{
				"how", "are", "you",
			},
		}
		flattenArray := Flatten(stringNestedArray)

		assert.EqualValues(t, []string{"hello", "sir", "how", "are", "you"}, flattenArray)
	})
}
