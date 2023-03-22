package tags

import (
	"fmt"
	"regexp"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBuildTitleWithTags(t *testing.T) {

	t.Run("should work with no tags", func(t *testing.T) {

		parts := TaskTitleParts{{
			Text:  "hello",
			IsTag: false,
		}, {
			Text:  "world",
			IsTag: false,
		}}

		title := BuildTitleWithTags(parts)

		assert.EqualValues(t, "hello world", title)
	})

	t.Run("should work with one leading tag", func(t *testing.T) {

		parts := TaskTitleParts{{
			Text:  "feature",
			IsTag: true,
		}, {
			Text:  "hello world",
			IsTag: false,
		}}

		title := BuildTitleWithTags(parts)

		matchingRegex := regexp.MustCompile("<.*>feature<.*> hello world")

		titleMatches := matchingRegex.MatchString(title)

		assert.True(t, titleMatches, fmt.Sprintf("title does not match regex. Title=%s", title))
	})

	t.Run("should work with multiple tags", func(t *testing.T) {

		parts := TaskTitleParts{{
			Text:  "feature",
			IsTag: true,
		}, {
			Text:  "hello",
			IsTag: false,
		}, {
			Text:  "design",
			IsTag: true,
		}, {
			Text:  "world",
			IsTag: false,
		}}

		title := BuildTitleWithTags(parts)

		matchingRegex := regexp.MustCompile("<.*>feature<.*> hello <.*>design<.*> world")

		titleMatches := matchingRegex.MatchString(title)

		assert.True(t, titleMatches, fmt.Sprintf("title does not match regex. Title=%s", title))

	})
}
