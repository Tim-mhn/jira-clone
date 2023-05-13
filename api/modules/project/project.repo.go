package project

import (
	"database/sql"
	"fmt"
	"time"

	sq "github.com/Masterminds/squirrel"

	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type ProjectRepository interface {
	GetProjectByID(projectID string) (Project, error)
	GetProjectMembers(projectID string) ([]ProjectMember, error)
	GetProjectsOfUser(userID string) ([]Project, error)
	MemberIsInProject(projectID string, memberID string) (bool, error)
	CreateProject(name string, key string, creator auth.User) (Project, error)
	AddMemberToProject(projectID string, userID string) error
	DeleteProjectByID(projectID string) error
}
type _SQLProjectRepository struct {
	conn     *sql.DB
	userRepo auth.UserRepository
}

func (pm *_SQLProjectRepository) CreateProject(name string, key string, creator auth.User) (Project, error) {
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

func (pm *_SQLProjectRepository) AddMemberToProject(projectID string, userID string) error {

	_, getProjectErr := pm.GetProjectByID(projectID)

	if getProjectErr != nil {
		return getProjectErr
	}

	_, getUserErr := pm.userRepo.GetUserByID(userID)

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

func (pm *_SQLProjectRepository) DeleteProjectByID(projectID string) error {

	psql := database.GetPsqlQueryBuilder()
	sql := psql.Update("project").Set("deleted", true).Where(sq.Eq{
		"id": projectID,
	})

	_, err := sql.RunWith(pm.conn).Exec()

	return err

}

func (pm *_SQLProjectRepository) GetProjectByID(projectID string) (Project, error) {
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

func (repo *_SQLProjectRepository) GetProjectMembers(projectID string) ([]ProjectMember, error) {

	builder := database.GetPsqlQueryBuilder()
	query := builder.Select("user_id", `"user".name as username`, `"user".email as user_email`, "joined_on").
		From("project_user").
		InnerJoin("project ON project.id=project_user.project_id ").
		InnerJoin(`"user" ON "user".id=project_user.user_id`).
		Where(
			sq.Eq{
				"project.id": projectID,
			},
		)

	sql, args, _ := query.ToSql()
	fmt.Print(sql, args)
	rows, err := query.RunWith(repo.conn).Query()

	if err != nil {
		return []ProjectMember{}, err
	}

	defer rows.Close()

	var projectMembers []ProjectMember

	for rows.Next() {
		var memberId string
		var memberName string
		var memberEmail string
		var joinedOn time.Time
		rows.Scan(&memberId, &memberName, &memberEmail, &joinedOn)

		user := auth.BuildUserWithIcon(memberId, memberName, memberEmail)

		member := ProjectMember{
			user,
			joinedOn,
		}
		projectMembers = append(projectMembers, member)
	}

	return projectMembers, nil

}

func (pm *_SQLProjectRepository) GetProjectsOfUser(userID string) ([]Project, error) {

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

func (pm *_SQLProjectRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {

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
