package tags

import (
	"fmt"
	"regexp"

	"github.com/tim-mhn/figma-clone/utils/arrays"
)

func extractTagsFromHTMLTitle(htmlTitle string) []string {

	fmt.Println(htmlTitle)
	regex := buildFindTagsRegex()

	matches := regex.FindAllStringSubmatch(htmlTitle, -1)
	for i, name := range regex.SubexpNames() {
		if i != 0 && name != "" {
			print(matches[i])
		}
	}

	tags := arrays.MapArray(matches, func(match []string) string {
		return match[1]
	})

	fmt.Println(tags)

	return tags
}

func buildFindTagsRegex() *regexp.Regexp {
	regexString := fmt.Sprintf(`%s#?(.*?)%s`, TASK_TAG_TEMPLATE_OPENING_TAG, TASK_TAG_TEMPLATE_CLOSING_TAG)
	return regexp.MustCompile(regexString)
}
