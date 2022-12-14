package services

import (
	"testing"

	"github.com/tim-mhn/figma-clone/models"
)

func TestMoveBacklogSprintAtTheEnd(t *testing.T) {
	sprint1 := models.Sprint{
		Id:        "1",
		Name:      "Sprint 1",
		IsBacklog: false,
	}
	backlog := models.Sprint{
		Id:        "backlog-id",
		Name:      "Backlog",
		IsBacklog: true,
	}
	sprint2 := models.Sprint{
		Id:        "2",
		Name:      "Sprint 2",
		IsBacklog: false,
	}

	var sprints = []models.Sprint{sprint1, backlog, sprint2}

	sortedSprint := moveBacklogSprintAtTheEnd(sprints)

	lastSprint := sortedSprint[len(sortedSprint)-1]

	testPassed := lastSprint == backlog

	if !testPassed {
		t.Logf(`error. Expected backlog as last element. Instead got %s`, lastSprint.Name)
		t.Fail()
	}

}
