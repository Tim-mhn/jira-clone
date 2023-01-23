package project

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"

	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type ProjectQueriesRepository struct {
	conn *sql.DB
}

func NewProjectQueriesRepository(conn *sql.DB) *ProjectQueriesRepository {
	return &ProjectQueriesRepository{
		conn: conn,
	}

}

func (pm *ProjectQueriesRepository) GetProjectByID(projectID string) (Project, error) {
	var project Project

	sql := getProjectsQueryBuilder().
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

func (pm *ProjectQueriesRepository) GetProjectMembers(projectID string) ([]auth.User, error) {

	var projectMembers []auth.User
	getMembersQuery := fmt.Sprintf(`
	SELECT user_id, "user".name as user_name, "user".email as user_email FROM project_user 
	INNER JOIN project ON project.id=project_user.project_id 
	INNER JOIN "user" ON "user".id=project_user.user_id
	WHERE project.id=project_user.project_id
	AND project.id='%s';`, projectID)

	rows, err := pm.conn.Query(getMembersQuery)

	if err != nil {
		return []auth.User{}, err
	}

	defer rows.Close()

	for rows.Next() {
		var memberId string
		var memberName string
		var memberEmail string
		rows.Scan(&memberId, &memberName, &memberEmail)

		member := auth.BuildUserWithIcon(memberId, memberName, memberEmail)
		projectMembers = append(projectMembers, member)
	}

	return projectMembers, nil

}

func (pm *ProjectQueriesRepository) GetProjectsOfUser(userID string) ([]Project, error) {

	query := getProjectsQueryBuilder().
		Where(sq.Eq{
			"project_user.user_id": userID,
		})

	rows, err := query.RunWith(pm.conn).Query()

	if err != nil {
		return []Project{}, err
	}

	defer rows.Close()

	var userProjects []Project
	for rows.Next() {
		project, err := buildProjectFromQueryRows(rows)

		if err != nil {
			return []Project{}, err
		}
		userProjects = append(userProjects, project)
	}

	return userProjects, nil

}

func (pm *ProjectQueriesRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {

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

func getProjectsQueryBuilder() sq.SelectBuilder {
	psql := database.GetPsqlQueryBuilder()

	builder := psql.Select(
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
			"deleted": false,
		})

	return builder
}

func buildProjectFromQueryRows(rows *sql.Rows) (Project, error) {
	var project Project
	var creator auth.User
	err := rows.Scan(&project.Id, &project.Name, &project.Key, &creator.Id, &creator.Name, &creator.Email)

	if err != nil {
		return Project{}, err
	}
	project.Icon = getProjectIcon(project.Id)

	creator = auth.BuildUserWithIcon(creator.Id, creator.Name, creator.Email)
	project.Creator = creator
	return project, nil
}
