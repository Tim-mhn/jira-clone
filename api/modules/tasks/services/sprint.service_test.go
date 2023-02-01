package tasks_services

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

type _TestSprint struct {
	Name         string
	Backlog      bool
	CreationTime time.Time
}

func (s _TestSprint) IsBacklog() bool {
	return s.Backlog
}

func (s _TestSprint) CreatedOn() time.Time {
	return s.CreationTime
}
func TestMoveBacklogSprintAtTheEnd(t *testing.T) {
	decemberSprint := _TestSprint{
		Name:         "Sprint 1",
		Backlog:      false,
		CreationTime: time.Date(2022, 12, 1, 1, 0, 0, 0, time.Local),
	}

	backlog := _TestSprint{
		Name:         "Backlog sprint",
		Backlog:      true,
		CreationTime: time.Date(2023, 1, 1, 1, 0, 0, 0, time.Local),
	}
	februarySprint := _TestSprint{
		Name:         "Sprint 2",
		Backlog:      false,
		CreationTime: time.Date(2022, 2, 1, 1, 0, 0, 0, time.Local),
	}

	julySprint := _TestSprint{
		Name:         "Sprint 3",
		Backlog:      false,
		CreationTime: time.Date(2022, 7, 1, 1, 0, 0, 0, time.Local),
	}

	var sprints = []_TestSprint{decemberSprint, backlog, februarySprint, julySprint}

	sortedSprints := moveBacklogSprintAtTheEnd(sprints)

	expectedSortedSprints := []_TestSprint{decemberSprint, julySprint, februarySprint, backlog}

	assert.EqualValues(t, sortedSprints, expectedSortedSprints, "it should sort sprints by descending creationDate and move backlog at the end regardless")

}
