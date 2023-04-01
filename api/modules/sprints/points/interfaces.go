package sprint_points

type SprintPointsRepository interface {
	GetSprintPointsBreakdown(sprintID string) (SprintPointsBreakdown, error)
}
