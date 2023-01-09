package arrays

func SortWithComparison[T any](arr []T, comparison func(a T, b T) bool) []T {
	start := 0
	end := len(arr) - 1

	quicksort(arr, start, end, comparison)
	return arr
}
func Sort(arr []int) []int {
	start := 0
	end := len(arr) - 1

	numberComparison := func(a int, b int) bool {
		return b-a > 0
	}
	quicksort(arr, start, end, numberComparison)
	return arr
}
func quicksort[T any](arr []T, start, end int, comparison func(a T, b T) bool) {
	if (end - start) < 1 {
		return
	}

	pivot := arr[end]
	splitIndex := start

	for i := start; i < end; i++ {
		if comparison(arr[i], pivot) {
			temp := arr[splitIndex]

			arr[splitIndex] = arr[i]
			arr[i] = temp

			splitIndex++
		}
	}

	arr[end] = arr[splitIndex]
	arr[splitIndex] = pivot

	quicksort(arr, start, splitIndex-1, comparison)
	quicksort(arr, splitIndex+1, end, comparison)
}
