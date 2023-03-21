package tags

import "strings"

const NON_BREAKING_SPACE_CHAR = "&nbsp;"

func RemoveTagsFromTaskTitle(taskTitle string) string {

	regex := buildFindTagsRegex()

	matches := regex.FindAllStringSubmatch(taskTitle, -1)

	for _, match := range matches {
		fullTag := match[0]

		noReplacementsLimit := -1
		taskTitle = strings.Replace(taskTitle, fullTag, "", noReplacementsLimit)
	}

	titleWithoutNbps := strings.ReplaceAll(taskTitle, NON_BREAKING_SPACE_CHAR, " ")
	return titleWithoutNbps

}
