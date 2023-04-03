package tags

import (
	"fmt"
	"regexp"
)

const TASK_TAG_OPENING_TAG_REGEX = `<span class="task-tag".*?>`
const TASK_TAG_TEMPLATE_OPENING_TAG = `<span class="task-tag" contenteditable="false">`
const TASK_TAG_TEMPLATE_CLOSING_TAG = `</span>`

func buildFindTagsRegex() *regexp.Regexp {
	regexString := fmt.Sprintf(`%s#?(.*?)%s`, TASK_TAG_OPENING_TAG_REGEX, TASK_TAG_TEMPLATE_CLOSING_TAG)
	return regexp.MustCompile(regexString)
}

func TASK_TAG_TEMPLATE() TaskTagTemplate {
	return fmt.Sprintf(`%s#{{TAG}}%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)
}
