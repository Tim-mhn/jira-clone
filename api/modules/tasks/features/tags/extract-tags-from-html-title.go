package tags

import (
	"fmt"

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
