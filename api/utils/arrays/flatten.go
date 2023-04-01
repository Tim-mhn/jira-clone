package arrays

func Flatten[T any](array [][]T) []T {
	var flattenArray []T

	for _, subArray := range array {
		flattenArray = append(flattenArray, subArray...)
	}

	return flattenArray
}
