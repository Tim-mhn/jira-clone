package sprints

import (
	"time"
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

type Sprint struct {
	SprintInfo
	Points SprintPointsBreakdown
}

type _UpdateSprint struct {
	Name      *string    `json:"name,omitempty"`
	StartDate *time.Time `json:"startDate,omitempty"`
	EndDate   *time.Time `json:"endDate,omitempty"`
}
