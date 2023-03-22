package tags

import (
	"fmt"

	"github.com/tim-mhn/figma-clone/utils/arrays"
)

type TaskTitlePart struct {
	Text  string
	IsTag bool
}

type TaskTitleParts = []TaskTitlePart

func BuildTitleWithTags(parts TaskTitleParts) string {
	words := arrays.MapArray(parts, func(part TaskTitlePart) string {
		if !part.IsTag {
			return part.Text
		}

		return buildTagFromText(part.Text)
	})

	return arrays.Join(words, " ")
}

func buildTagFromText(tagText string) string {
	return fmt.Sprintf("%s%s%s", TASK_TAG_TEMPLATE_OPENING_TAG, tagText, TASK_TAG_TEMPLATE_CLOSING_TAG)
}
