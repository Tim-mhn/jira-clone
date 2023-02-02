package arrays

import "strconv"

func MapArray[T any, K any](data []T, f func(T) K) []K {

	mapped := make([]K, len(data))

	for i, e := range data {
		mapped[i] = f(e)
	}

	return mapped
}

func MapStringsToInts(data []string) []int {
	return MapArray(data, func(stringifiedNumber string) int {
		number, _ := strconv.Atoi(stringifiedNumber)
		return number
	})
}
