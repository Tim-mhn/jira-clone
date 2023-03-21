package tags

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRemoveTagsFromTaskTitle(t *testing.T) {

	t.Run("it should return the title without the tag when there is only one preceding tag", func(t *testing.T) {

		tag := fmt.Sprintf(`%sinside the tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)
		titleWithOneTag := fmt.Sprintf(`%sThis is the task title`, tag)

		titleWithoutTags := RemoveTagsFromTaskTitle(titleWithOneTag)

		expectedTitle := "This is the task title"
		assert.EqualValues(t, expectedTitle, titleWithoutTags)
	})

	t.Run("it should return the title without the tag when there is only one trailing tag", func(t *testing.T) {

		tag := fmt.Sprintf(`%sinside the tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)
		titleWithOneTag := fmt.Sprintf(`This is the task title%s`, tag)

		titleWithoutTags := RemoveTagsFromTaskTitle(titleWithOneTag)

		expectedTitle := "This is the task title"
		assert.EqualValues(t, expectedTitle, titleWithoutTags)
	})

	t.Run("it should return the title with multiple and different tags around the title", func(t *testing.T) {

		tag1 := fmt.Sprintf(`%sinside the tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)
		tag2 := fmt.Sprintf(`%sa tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)

		tag3 := fmt.Sprintf(`%shello%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)

		tag4 := fmt.Sprintf(`%sanother tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)

		titleWithOneTag := fmt.Sprintf(`%s%sThis is the task title%s%s`, tag1, tag2, tag3, tag4)

		titleWithoutTags := RemoveTagsFromTaskTitle(titleWithOneTag)

		expectedTitle := "This is the task title"
		assert.EqualValues(t, expectedTitle, titleWithoutTags)
	})

	t.Run("it should return the title with tags within the title ", func(t *testing.T) {

		tag1 := fmt.Sprintf(`%sinside the tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)
		tag2 := fmt.Sprintf(`%sa tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)

		tag3 := fmt.Sprintf(`%shello%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)

		tag4 := fmt.Sprintf(`%sanother tag%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)

		titleWithOneTag := fmt.Sprintf(`%sThis %sis the%s task title%s`, tag1, tag2, tag3, tag4)

		titleWithoutTags := RemoveTagsFromTaskTitle(titleWithOneTag)

		expectedTitle := "This is the task title"
		assert.EqualValues(t, expectedTitle, titleWithoutTags)
	})

	t.Run("it should replace any non-breaking space html character by a space", func(t *testing.T) {

		tite := "This is a&nbsp;title"
		titleWithoutTags := RemoveTagsFromTaskTitle(tite)

		assert.EqualValues(t, "This is a title", titleWithoutTags)

	})
}
