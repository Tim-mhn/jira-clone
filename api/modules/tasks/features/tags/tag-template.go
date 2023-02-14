package tags

import "fmt"

const TASK_TAG_TEMPLATE_OPENING_TAG = `<span class="task-tag">`
const TASK_TAG_TEMPLATE_CLOSING_TAG = `</span>`

func TASK_TAG_TEMPLATE() TaskTagTemplate {
	return fmt.Sprintf(`%s#{{TAG}}%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)
}
