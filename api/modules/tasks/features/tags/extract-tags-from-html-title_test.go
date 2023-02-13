package tags

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractTagsFromHTMLTitle(t *testing.T) {

	t.Run("it should correctly extract the first tag from the html title", func(t *testing.T) {
		htmlTitle := "This is a <tag>backend</tag>"

		tags := extractTagsFromHTMLTitle(htmlTitle)

		assert.EqualValues(t, "backend", tags[0], "expected 'backend'")
	})

	t.Run("it should correctly extract all tags from the html title", func(t *testing.T) {
		htmlTitle := "This is for <tag>backend</tag>ok<tag>frontend</tag>"

		tags := extractTagsFromHTMLTitle(htmlTitle)

		assert.EqualValues(t, []string{"backend", "frontend"}, tags)
	})

	t.Run("it should return an empty string if there are no matches", func(t *testing.T) {
		htmlTitle := "There are no tags"

		tags := extractTagsFromHTMLTitle(htmlTitle)

		assert.EqualValues(t, []string{}, tags)
	})

}
