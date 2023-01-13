package tasks_models

type SprintInfo struct {
	Id        string
	Name      string
	IsBacklog bool
}

type Sprint struct {
	SprintInfo
	Points SprintPointsBreakdown
}
