package sprints

import (
	"time"

	sprint_points "github.com/tim-mhn/figma-clone/modules/sprints/points"
)

type SprintID = string
type SprintName = string
type SprintInfo struct {
	Id           SprintID
	Name         SprintName
	IsBacklog    bool
	CreationTime time.Time
	StartDate    *time.Time
	EndDate      *time.Time
	Completed    bool
}

type SprintIdName struct {
	Name SprintName
	Id   SprintID
}

type Sprint struct {
	SprintInfo
	Points sprint_points.SprintPointsBreakdown
}

type UpdateSprint struct {
	Name      *string    `json:"name,omitempty"`
	StartDate *time.Time `json:"startDate,omitempty"`
	EndDate   *time.Time `json:"endDate,omitempty"`
}
