package arrays

func MapArray[T any, K any](data []T, f func(T) K) []K {

	mapped := make([]K, len(data))

	for i, e := range data {
		mapped[i] = f(e)
	}

	return mapped
}
