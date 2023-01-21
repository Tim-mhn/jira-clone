package tasks_repositories

import (
	"database/sql"
	"fmt"

	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
)

type SprintRepository struct {
	conn   *sql.DB
	logger shared_errors.ErrorBuilder
}

func NewSprintRepository(conn *sql.DB) *SprintRepository {
	return &SprintRepository{
		conn:   conn,
		logger: shared_errors.GetErrorBuilderForContext("SprintRepository"),
	}
}

func (sprintRepo SprintRepository) GetActiveSprintsOfProject(projectID string) ([]tasks_models.SprintInfo, error) {
	query := fmt.Sprintf(`SELECT id, name, is_backlog from sprint WHERE sprint.project_id='%s' AND sprint.deleted=false AND sprint.completed=false`, projectID)
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

func (sprintRepo SprintRepository) CreateSprint(name string, projectID string) (string, error) {
	newSprintIsNotBacklog := "false"

	query := fmt.Sprintf(`INSERT INTO sprint (name, project_id, is_backlog)
	VALUES ('%s', '%s', %s)
	RETURNING id`, name, projectID, newSprintIsNotBacklog)

	rows, err := sprintRepo.conn.Query(query)

	if err != nil {
		errorWithContext := sprintRepo.logger.LogAndBuildError("CreateSprint", err)
		return "", errorWithContext

	}
	defer rows.Close()

	var sprintID string
	if rows.Next() {
		err := rows.Scan(&sprintID)

		if err != nil {
			errorWithContext := sprintRepo.logger.LogAndBuildError("CreateSprint", err)
			return "", errorWithContext

		}
	}

	return sprintID, nil
}

func (sprintRepo SprintRepository) DeleteSprint(sprintID string) error {

	query := fmt.Sprintf(`UPDATE sprint SET deleted=true WHERE id='%s'`, sprintID)

	res, err := sprintRepo.conn.Exec(query)

	if err != nil {
		errorWithContext := sprintRepo.logger.LogAndBuildError("DeleteSprint", err)
		return errorWithContext

	}

	if rowsAffected, _ := res.RowsAffected(); rowsAffected == 0 {
		noRowsAffectedError := fmt.Errorf("no rows were affected")
		errorWithContext := sprintRepo.logger.LogAndBuildError("DeleteSprint", noRowsAffectedError)
		return errorWithContext
	}

	return nil
}

func (sprintRepo SprintRepository) MarkSprintAsCompleted(sprintID string) error {

	query := fmt.Sprintf(`UPDATE sprint SET completed=true WHERE id='%s'`, sprintID)

	res, err := sprintRepo.conn.Exec(query)

	if err != nil {
		errorWithContext := sprintRepo.logger.LogAndBuildError("MarkSprintAsCompleted", err)
		return errorWithContext

	}

	if rowsAffected, _ := res.RowsAffected(); rowsAffected == 0 {
		noRowsAffectedError := fmt.Errorf("no rows were affected")
		errorWithContext := sprintRepo.logger.LogAndBuildError("MarkSprintAsCompleted", noRowsAffectedError)
		return errorWithContext
	}

	return nil
}
