package tags

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTagTemplate(t *testing.T) {
	t.Run("it should build the correct HTML element", func(t *testing.T) {
		tag := "design"

		tagTemplate := TASK_TAG_TEMPLATE()

		htmlElement := strings.Replace(tagTemplate, "{{TAG}}", tag, 1)

		expectedHtmlElement := `<span class="task-tag">#design</span>`
		assert.Equal(t, expectedHtmlElement, htmlElement)
	})
}
