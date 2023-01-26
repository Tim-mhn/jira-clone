package tasks_services

import (
	"testing"
)

type TestOnlySprint struct {
	Name    string
	Backlog bool
}

func (s TestOnlySprint) IsBacklog() bool {
	return s.Backlog
}
func TestMoveBacklogSprintAtTheEnd(t *testing.T) {
	sprint1 := TestOnlySprint{
		Name:    "Sprint 1",
		Backlog: false,
	}

	backlog := TestOnlySprint{
		Name:    "Backlog sprint",
		Backlog: true,
	}
	sprint2 := TestOnlySprint{
		Name:    "Sprint 2",
		Backlog: false,
	}

	var sprints = []TestOnlySprint{sprint1, backlog, sprint2}

	sortedSprint := moveBacklogSprintAtTheEnd(sprints)

	lastSprint := sortedSprint[len(sortedSprint)-1]

	testPassed := lastSprint == backlog

	if !testPassed {
		t.Logf(`error. Expected backlog as last element. Instead got %s`, lastSprint.Name)
		t.Fail()
	}

}
