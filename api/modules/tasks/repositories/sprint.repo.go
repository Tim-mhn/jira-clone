package tasks_repositories

import (
	"database/sql"
	"fmt"

	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type SprintRepository struct {
	conn *sql.DB
}

func NewSprintRepository(conn *sql.DB) *SprintRepository {
	return &SprintRepository{
		conn: conn,
	}
}

func (sprintRepo SprintRepository) GetSprintsOfProject(projectID string) ([]tasks_models.SprintInfo, error) {
	query := fmt.Sprintf(`SELECT id, name, is_backlog from sprint WHERE sprint.project_id='%s'`, projectID)
	rows, err := sprintRepo.conn.Query(query)

	if err != nil {
		return []tasks_models.SprintInfo{}, err
	}
	defer rows.Close()

	sprints := []tasks_models.SprintInfo{}

	for rows.Next() {
		var sprint tasks_models.SprintInfo

		err := rows.Scan(&sprint.Id, &sprint.Name, &sprint.IsBacklog)

		if err != nil {
			return []tasks_models.SprintInfo{}, err
		}

		sprints = append(sprints, sprint)

	}

	return sprints, nil
}
