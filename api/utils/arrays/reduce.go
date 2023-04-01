package arrays

func Reduce[T any, K any](array []T, accumulatorFn func(T, K) K, initialValue K) K {

	result := initialValue

	for _, element := range array {
		result = accumulatorFn(element, result)
	}

	return result
}
