package tasks_services

import (
	"testing"
)

type _TestSprint struct {
	Name    string
	Backlog bool
}

func (s _TestSprint) IsBacklog() bool {
	return s.Backlog
}
func TestMoveBacklogSprintAtTheEnd(t *testing.T) {
	sprint1 := _TestSprint{
		Name:    "Sprint 1",
		Backlog: false,
	}

	backlog := _TestSprint{
		Name:    "Backlog sprint",
		Backlog: true,
	}
	sprint2 := _TestSprint{
		Name:    "Sprint 2",
		Backlog: false,
	}

	var sprints = []_TestSprint{sprint1, backlog, sprint2}

	sortedSprint := moveBacklogSprintAtTheEnd(sprints)

	lastSprint := sortedSprint[len(sortedSprint)-1]

	testPassed := lastSprint == backlog

	if !testPassed {
		t.Logf(`error. Expected backlog as last element. Instead got %s`, lastSprint.Name)
		t.Fail()
	}

}
