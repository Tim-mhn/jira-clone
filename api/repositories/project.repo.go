package repositories

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
	"github.com/tim-mhn/figma-clone/utils"
)

type ProjectRepository struct {
	um   *UserRepository
	conn *sql.DB
}

func NewProjectRepository(um *UserRepository, conn *sql.DB) *ProjectRepository {
	return &ProjectRepository{
		um:   um,
		conn: conn,
	}

}

func (pm *ProjectRepository) CreateProject(name string) (models.Project, error) {
	query := fmt.Sprintf(`INSERT INTO project (name) VALUES ('%s') RETURNING id`, name)

	var projectID string

	rows, err := pm.conn.Query(query)

	if err != nil {
		return models.Project{}, err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&projectID)

		if err != nil {
			fmt.Println(err.Error())
			return models.Project{}, err
		}

	}

	return models.Project{
		Id:   projectID,
		Name: name,
	}, nil
}

func (pm *ProjectRepository) GetProjectByID(projectID string) (models.Project, error) {
	var project models.Project
	query := fmt.Sprintf(`SELECT * FROM "project" WHERE id='%s' LIMIT 1;`, projectID)
	rows, err := pm.conn.Query(query)

	if err != nil {
		return models.Project{}, err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&project.Id, &project.Name)

		if err != nil {
			return models.Project{}, err
		}
	}

	return project, nil

}

func (pm *ProjectRepository) MemberIsInProject(projectID string, memberID string) (bool, error) {

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

func (pm *ProjectRepository) AddMemberToProject(projectID string, userID string) error {

	_, getProjectErr := pm.GetProjectByID(projectID)

	if getProjectErr != nil {
		return getProjectErr
	}

	_, getUserErr := pm.um.GetUserByID(userID)

	if getUserErr != nil {
		return getUserErr
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

func (pm *ProjectRepository) GetProjectMembers(projectID string) ([]models.User, error) {

	var projectMembers []models.User
	getMembersQuery := fmt.Sprintf(`
	SELECT user_id, "user".name as user_name, "user".email as user_email FROM project_user 
	INNER JOIN project ON project.id=project_user.project_id 
	INNER JOIN "user" ON "user".id=project_user.user_id
	WHERE project.id=project_user.project_id
	AND project.id='%s';`, projectID)

	rows, err := pm.conn.Query(getMembersQuery)

	if err != nil {
		return []models.User{}, err
	}

	defer rows.Close()

	for rows.Next() {
		var memberId string
		var memberName string
		var memberEmail string
		rows.Scan(&memberId, &memberName, &memberEmail)

		member := utils.BuildUserWithIcon(memberId, memberName, memberEmail)
		projectMembers = append(projectMembers, member)
	}

	return projectMembers, nil

}

func (pm *ProjectRepository) GetProjectsOfUser(userID string) ([]models.Project, error) {
	query := fmt.Sprintf(`SELECT project.id as project_id, project.name as project_name FROM project 
JOIN  project_user ON project_user.project_id=project.id  
WHERE project_user.user_id='%s'`, userID)

	rows, err := pm.conn.Query(query)

	if err != nil {
		return []models.Project{}, err
	}

	defer rows.Close()

	var userProjects []models.Project
	for rows.Next() {
		var project models.Project
		rows.Scan(&project.Id, &project.Name)

		userProjects = append(userProjects, project)
	}

	return userProjects, nil

}
