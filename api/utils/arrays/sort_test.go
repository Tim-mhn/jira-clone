package arrays

import "testing"

func TestSort(t *testing.T) {
	var nums = []int{3, 5, 2}

	sortedNums := Sort(nums)

	testPassed := sortedNums[0] == 2 && sortedNums[1] == 3

	if !testPassed {
		t.Logf(`error. Expected [2, 3, 5]. Got %d`, sortedNums)
		t.Fail()
	}

}

func TestSortWithIdenticalNums(t *testing.T) {
	var nums = []int{3, 5, 2, 5, 3}

	// sortDesc := func(a int, b int) bool {
	// 	return a-b > 0
	// }
	sortedNums := Sort(nums)

	testPassed := sortedNums[0] == 2 && sortedNums[1] == 3 && sortedNums[2] == 3

	if !testPassed {
		t.Logf(`error. Expected [2, 3, 3, 5, 5]. Got %d`, sortedNums)
		t.Fail()
	}

}

type User struct {
	age  int
	name string
}

func TestSortWithComparison(t *testing.T) {
	bob := User{
		age:  20,
		name: "bob",
	}

	mike := User{
		age:  40,
		name: "mike",
	}

	tom := User{
		age:  30,
		name: "tom",
	}

	var users = []User{bob, mike, tom}

	sortByAgeAsc := func(u1 User, u2 User) bool {
		return u2.age-u1.age > 0
	}

	youngUsersFirst := SortWithComparison(users, sortByAgeAsc)

	testPassed := youngUsersFirst[0] == bob && youngUsersFirst[1] == tom

	if !testPassed {
		t.Logf(`error. Expected bob,tom,mike. Got %s, %s, %s`, youngUsersFirst[0].name, youngUsersFirst[1].name, youngUsersFirst[2].name)
	}
}
