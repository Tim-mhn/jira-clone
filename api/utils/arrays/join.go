package arrays

import "fmt"

func Join[T int | string](elements []T, separator string) string {
	joinedString := ""

	for index, el := range elements {
		stringifiedEl := fmt.Sprint(el)
		if index == 0 {
			joinedString = stringifiedEl

		} else {
			joinedString = fmt.Sprintf(`%s,%s`, joinedString, stringifiedEl)

		}
	}

	return joinedString
}
