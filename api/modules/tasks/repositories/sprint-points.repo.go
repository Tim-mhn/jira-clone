package tasks_repositories

import (
	"database/sql"
	"fmt"

	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SprintPointsRepository struct {
	conn *sql.DB
}

func NewSprintPointsRepository(conn *sql.DB) *SprintPointsRepository {
	return &SprintPointsRepository{
		conn: conn,
	}
}

func (sprintRepo SprintPointsRepository) GetSprintPointsBreakdown(sprintID string) (tasks_models.SprintPointsBreakdown, error) {
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
		return tasks_models.SprintPointsBreakdown{}, err
	}

	var pointsBreakdown tasks_models.SprintPointsBreakdown
	if rows.Next() {

		rows.Scan(&pointsBreakdown.New, &pointsBreakdown.InProgress, &pointsBreakdown.Done)

	}

	return pointsBreakdown, nil

}
