package tasks_services

import (
	"testing"

	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

func TestMoveBacklogSprintAtTheEnd(t *testing.T) {
	sprint1 := tasks_models.SprintInfo{
		Id:        "1",
		Name:      "Sprint 1",
		IsBacklog: false,
	}
	backlog := tasks_models.SprintInfo{
		Id:        "backlog-id",
		Name:      "Backlog",
		IsBacklog: true,
	}
	sprint2 := tasks_models.SprintInfo{
		Id:        "2",
		Name:      "Sprint 2",
		IsBacklog: false,
	}

	var sprints = []tasks_models.SprintInfo{sprint1, backlog, sprint2}

	sortedSprint := moveBacklogSprintAtTheEnd(sprints)

	lastSprint := sortedSprint[len(sortedSprint)-1]

	testPassed := lastSprint == backlog

	if !testPassed {
		t.Logf(`error. Expected backlog as last element. Instead got %s`, lastSprint.Name)
		t.Fail()
	}

}
