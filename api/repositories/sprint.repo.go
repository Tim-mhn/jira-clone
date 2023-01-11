package repositories

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

type SprintRepository struct {
	conn *sql.DB
}

func NewSprintRepository(conn *sql.DB) *SprintRepository {
	return &SprintRepository{
		conn: conn,
	}
}

func (sprintRepo SprintRepository) GetSprintsOfProject(projectID string) ([]models.SprintInfo, error) {
	query := fmt.Sprintf(`SELECT id, name, is_backlog from sprint WHERE sprint.project_id='%s'`, projectID)
	rows, err := sprintRepo.conn.Query(query)

	if err != nil {
		return []models.SprintInfo{}, err
	}
	defer rows.Close()

	sprints := []models.SprintInfo{}

	for rows.Next() {
		var sprint models.SprintInfo

		err := rows.Scan(&sprint.Id, &sprint.Name, &sprint.IsBacklog)

		if err != nil {
			return []models.SprintInfo{}, err
		}

		sprints = append(sprints, sprint)

	}

	return sprints, nil
}
