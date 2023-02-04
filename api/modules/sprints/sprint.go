package sprints

import "time"

type SprintID = string
type SprintName = string
type SprintInfo struct {
	Id           SprintID
	Name         SprintName
	IsBacklog    bool
	CreationTime time.Time
}

type Sprint struct {
	SprintInfo
	Points SprintPointsBreakdown
}
