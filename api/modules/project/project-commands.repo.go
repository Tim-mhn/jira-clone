package project

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type ProjectCommandsRepository struct {
	um   *auth.UserRepository
	conn *sql.DB
}

func NewProjectCommandsRepository(um *auth.UserRepository, conn *sql.DB) *ProjectCommandsRepository {
	return &ProjectCommandsRepository{
		um:   um,
		conn: conn,
	}

}

func (pm *ProjectCommandsRepository) CreateProject(name string, key string, creator auth.User) (Project, error) {
	query := fmt.Sprintf(`INSERT INTO project (name, key, creator_id) VALUES ('%s', '%s', '%s') RETURNING id`, name, key, creator.Id)

	var projectID string

	rows, err := pm.conn.Query(query)

	if err != nil {
		return Project{}, err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&projectID)

		if err != nil {
			fmt.Println(err.Error())
			return Project{}, err
		}

	}

	return Project{
		Id:   projectID,
		Name: name,
		Key:  key,
	}, nil
}

func (pm *ProjectCommandsRepository) GetProjectByID(projectID string) (Project, error) {
	var project Project

	psql := database.GetPsqlQueryBuilder()

	sql := psql.Select(
		"project.id as project_id",
		"project.name as project_name",
		"project.key as project_key",
		`COALESCE("user".id, '') as creator_id`,
		`COALESCE("user".name, '') as creator_name`,
		`COALESCE("user".email, '') as creator_email`).
		From("project").
		Join("project_user ON project_user.project_id=project.id").
		LeftJoin(`"user" ON project.creator_id="user".id`).
		Where(sq.Eq{
			"project.id": projectID,
		}).
		Limit(1)

	rows, err := sql.RunWith(pm.conn).Query()

	if err != nil {
		return Project{}, err
	}

	defer rows.Close()

	if rows.Next() {

		project, err = buildProjectFromQueryRows(rows)

		if err != nil {
			return Project{}, err
		}
	}

	return project, nil

}

func (pm *ProjectCommandsRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {

	var resultsCount int
	query := fmt.Sprintf(`SELECT COUNT(*) FROM "project_user" WHERE project_id='%s' AND user_id='%s' LIMIT 1`, projectID, memberID)

	rows, err := pm.conn.Query(query)

	if err != nil {
		return false, err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&resultsCount)

		if err != nil {
			return false, err
		}
	}

	return resultsCount > 0, nil
}

func (pm *ProjectCommandsRepository) AddMemberToProject(projectID string, userID string) error {

	_, getProjectErr := pm.GetProjectByID(projectID)

	if getProjectErr != nil {
		return getProjectErr
	}

	_, getUserErr := pm.um.GetUserByID(userID)

	if getUserErr.HasError {
		return getUserErr.Source
	}

	isInProject, err := pm.MemberIsInProject(projectID, userID)

	if err != nil {
		return err
	}

	if isInProject {
		return fmt.Errorf("member is already in project")
	}

	query := fmt.Sprintf(`INSERT INTO project_user (project_id, user_id) VALUES ('%s', '%s')`, projectID, userID)
	rows, err := pm.conn.Query(query)

	if err != nil {
		return err
	}
	defer rows.Close()

	return nil

}
