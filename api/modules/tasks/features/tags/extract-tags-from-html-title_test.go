package tags

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractTagsFromHTMLTitle(t *testing.T) {

	t.Run(`it should correctly extract the first tag from the html title`, func(t *testing.T) {
		htmlTitle := `This is a <span class="task-tag">#backend</span>`

		tags := ExtractTagsFromHTMLTitle(htmlTitle)

		assert.EqualValues(t, "backend", tags[0], "expected 'backend'")
	})

	t.Run(`it should correctly extract all tags from the html title`, func(t *testing.T) {
		htmlTitle := `This is for <span class="task-tag">#backend</span>ok<span class="task-tag">#frontend</span>`

		tags := ExtractTagsFromHTMLTitle(htmlTitle)

		assert.EqualValues(t, []string{"backend", "frontend"}, tags)
	})

	t.Run(`it should return an empty string if there are no matches`, func(t *testing.T) {
		htmlTitle := "There are no tags"

		tags := ExtractTagsFromHTMLTitle(htmlTitle)

		assert.EqualValues(t, []string{}, tags)
	})

	t.Run(`it should work without the hashtag "#" `, func(t *testing.T) {
		htmlTitle := `This is for <span class="task-tag">backend</span>ok<span class="task-tag">#frontend</span>`

		tags := ExtractTagsFromHTMLTitle(htmlTitle)

		assert.EqualValues(t, []string{"backend", "frontend"}, tags)
	})

}
