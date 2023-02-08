package sprints

import (
	"database/sql"
	"fmt"
)

type SprintPointsRepository struct {
	conn *sql.DB
}

func NewSprintPointsRepository(conn *sql.DB) *SprintPointsRepository {
	return &SprintPointsRepository{
		conn: conn,
	}
}

func (sprintRepo SprintPointsRepository) GetSprintPointsBreakdown(sprintID string) (SprintPointsBreakdown, SprintError) {
	query := fmt.Sprintf(`SELECT   
COALESCE(SUM(task.points) FILTER (WHERE task_status.is_new= TRUE),0) AS is_new_points,
COALESCE(SUM(task.points) FILTER (WHERE task_status.is_new= FALSE AND task_status.is_done=FALSE),0) AS in_progress_points,
COALESCE(SUM(task.points) FILTER (WHERE task_status.is_done= TRUE),0) AS is_done_points
FROM task 
JOIN task_status ON task.status=task_status.id   
WHERE task.sprint_id='%s'
GROUP BY  task.sprint_id`, sprintID)

	rows, err := sprintRepo.conn.Query(query)

	if err != nil {
		return SprintPointsBreakdown{}, BuildSprintError(OtherSprintError, err)
	}

	var pointsBreakdown SprintPointsBreakdown
	if rows.Next() {

		err := rows.Scan(&pointsBreakdown.New, &pointsBreakdown.InProgress, &pointsBreakdown.Done)

		if err != nil {
			return SprintPointsBreakdown{}, BuildSprintError(OtherSprintError, err)
		}

	}

	return pointsBreakdown, NoSprintError()

}
