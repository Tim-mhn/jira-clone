package tasks_repositories

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
)

type SprintRepository interface {
	GetActiveSprintsOfProject(projectID string) ([]tasks_models.SprintInfo, error)
	CreateSprint(name string, projectID string) (string, error)
	DeleteSprint(sprintID string) error
	UpdateSprint(sprintID tasks_models.SprintID, sprintName tasks_models.SprintName) tasks_errors.SprintError
	MarkSprintAsCompleted(sprintID string) error
	GetSprintInfo(sprintID string) (tasks_models.SprintInfo, tasks_errors.SprintError)
}
type SQLSprintRepository struct {
	conn   *sql.DB
	logger shared_errors.ErrorBuilder
}

func NewSprintRepository(conn *sql.DB) SprintRepository {
	return &SQLSprintRepository{
		conn:   conn,
		logger: shared_errors.GetErrorBuilderForContext("SprintRepository"),
	}
}

func (sprintRepo SQLSprintRepository) GetActiveSprintsOfProject(projectID string) ([]tasks_models.SprintInfo, error) {
	query := fmt.Sprintf(`SELECT id, name, is_backlog, created_on from sprint WHERE sprint.project_id='%s' AND sprint.deleted=false AND sprint.completed=false`, projectID)
	rows, err := sprintRepo.conn.Query(query)

	if err != nil {
		return []tasks_models.SprintInfo{}, err
	}
	defer rows.Close()

	sprints := []tasks_models.SprintInfo{}

	for rows.Next() {
		var sprint tasks_models.SprintInfo

		err := rows.Scan(&sprint.Id, &sprint.Name, &sprint.IsBacklog, &sprint.CreationTime)

		if err != nil {
			return []tasks_models.SprintInfo{}, err
		}

		sprints = append(sprints, sprint)

	}

	return sprints, nil
}

func (sprintRepo SQLSprintRepository) CreateSprint(name string, projectID string) (string, error) {
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

func (sprintRepo SQLSprintRepository) GetSprintInfo(sprintID string) (tasks_models.SprintInfo, tasks_errors.SprintError) {
	psql := database.GetPsqlQueryBuilder()

	query := psql.Select("id", "name", "is_backlog", "created_on").From("sprint").Where(sq.Eq{"id": sprintID})

	rows, err := query.RunWith(sprintRepo.conn).Query()

	if err != nil {
		return tasks_models.SprintInfo{}, tasks_errors.BuildSprintError(tasks_errors.OtherSprintError, err)
	}

	defer rows.Close()

	var sprint tasks_models.SprintInfo

	if rows.Next() {
		err := rows.Scan(&sprint.Id, &sprint.Name, &sprint.IsBacklog, &sprint.CreationTime)

		if err != nil {
			return tasks_models.SprintInfo{}, tasks_errors.BuildSprintError(tasks_errors.OtherSprintError, err)

		}
	}

	return sprint, tasks_errors.NoSprintError()
}

func (sprintRepo SQLSprintRepository) DeleteSprint(sprintID string) error {

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

func (sprintRepo SQLSprintRepository) UpdateSprint(sprintID tasks_models.SprintID, sprintName tasks_models.SprintName) tasks_errors.SprintError {

	psql := database.GetPsqlQueryBuilder()
	query := psql.Update("sprint").Set("name", sprintName).Where(sq.Eq{"id": sprintID})

	res, err := query.RunWith(sprintRepo.conn).Exec()

	if err != nil {
		return tasks_errors.BuildSprintError(tasks_errors.OtherSprintError, err)
	}

	if rowsAffected, _ := res.RowsAffected(); rowsAffected == 0 {
		return tasks_errors.BuildSprintError(tasks_errors.SprintNotFound, err)
	}

	return tasks_errors.NoSprintError()

}

func (sprintRepo SQLSprintRepository) MarkSprintAsCompleted(sprintID string) error {

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
