package sprints

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/shared"
	shared_errors "github.com/tim-mhn/figma-clone/shared/errors"
)

type SprintRepository interface {
	GetActiveSprintsOfProject(projectID string) ([]SprintInfo, error)
	CreateSprint(name string, projectID string) (string, error)
	DeleteSprint(sprintID string) error
	UpdateSprint(sprintID SprintID, updateSprint _UpdateSprint) SprintError
	MarkSprintAsCompleted(sprintID string) error
	GetSprintInfo(sprintID string) (SprintInfo, SprintError)
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

func (sprintRepo SQLSprintRepository) GetActiveSprintsOfProject(projectID string) ([]SprintInfo, error) {

	query := sprintQueryBuilder().
		Where(sq.And{
			sq.Eq{
				"sprint.project_id": projectID,
			},
			sq.Eq{
				"sprint.deleted": false,
			},
			sq.Eq{
				"sprint.completed": false,
			},
		})
	rows, err := query.RunWith(sprintRepo.conn).Query()

	if err != nil {
		return []SprintInfo{}, err
	}
	defer rows.Close()

	sprints := []SprintInfo{}

	for rows.Next() {
		sprint, err := scanSQLRowToSprintInfo(rows)

		if err != nil {
			return []SprintInfo{}, err
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

func (sprintRepo SQLSprintRepository) GetSprintInfo(sprintID string) (SprintInfo, SprintError) {
	query := sprintQueryBuilder().Where(sq.Eq{"id": sprintID})

	rows, err := query.RunWith(sprintRepo.conn).Query()

	if err != nil {
		return SprintInfo{}, BuildSprintError(OtherSprintError, err)
	}

	defer rows.Close()

	var sprint SprintInfo

	if rows.Next() {
		sprint, err = scanSQLRowToSprintInfo(rows)
		if err != nil {
			return SprintInfo{}, BuildSprintError(OtherSprintError, err)

		}
	}

	return sprint, NoSprintError()
}

func scanSQLRowToSprintInfo(rows *sql.Rows) (SprintInfo, error) {
	var sprint SprintInfo
	var startDate sql.NullTime
	var endDate sql.NullTime
	err := rows.Scan(&sprint.Id, &sprint.Name, &sprint.IsBacklog, &sprint.CreationTime, &startDate, &endDate)

	if err != nil {
		return SprintInfo{}, err
	}
	if startDate.Valid {
		sprint.StartDate = &startDate.Time
	}

	if endDate.Valid {
		sprint.EndDate = &endDate.Time
	}

	return sprint, nil
}

func sprintQueryBuilder() sq.SelectBuilder {
	psql := database.GetPsqlQueryBuilder()
	queryBuilder := psql.Select("id", "name", "is_backlog", "created_on", "start_date", "end_date").
		From("sprint")

	return queryBuilder

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

func (sprintRepo SQLSprintRepository) UpdateSprint(sprintID SprintID, updateSprint _UpdateSprint) SprintError {

	ApiToDBFields := map[string]string{
		"name":      "name",
		"startDate": "start_date",
		"endDate":   "end_date",
	}

	updateQuery := shared.BuildSQLUpdateQuery("sprint", updateSprint, ApiToDBFields, shared.SQLCondition{
		Field: "id",
		Value: sprintID,
	})

	sql, args, _ := updateQuery.ToSql()
	fmt.Print(sql, args)
	res, err := updateQuery.RunWith(sprintRepo.conn).Exec()

	if err != nil {
		return BuildSprintError(OtherSprintError, err)
	}

	if rowsAffected, _ := res.RowsAffected(); rowsAffected == 0 {
		return BuildSprintError(SprintNotFound, err)
	}

	return NoSprintError()

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
