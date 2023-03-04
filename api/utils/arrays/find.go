package arrays

func Find[T any](arr []T, predicate func(t T) bool) (T, bool) {
	for _, element := range arr {
		if predicate(element) {
			return element, true
		}
	}

	return *new(T), false

}
