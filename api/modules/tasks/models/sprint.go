package tasks_models

import "time"

type SprintInfo struct {
	Id           string
	Name         string
	IsBacklog    bool
	CreationTime time.Time
}

type Sprint struct {
	SprintInfo
	Points SprintPointsBreakdown
}
