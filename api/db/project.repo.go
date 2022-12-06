package db

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
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

	var newProject models.Project

	rows, err := pm.conn.Query(query)

	if err != nil {
		return models.Project{}, err
	}

	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(&newProject.Id)

		if err != nil {
			fmt.Println(err.Error())
			return models.Project{}, err
		}

		fmt.Println(newProject)
	}

	return newProject, nil
}

func (pm *ProjectRepository) getProjectByID(projectID string) (models.Project, error) {
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

func (pm *ProjectRepository) memberIsInProject(projectID string, memberID string) bool {

	var resultsCount int
	query := fmt.Sprintf(`SELECT COUNT(*) FROM project_user WHERE project_id='%s' AND user_id='%s' LIMIT 1`, projectID, memberID)
	rows, _ := pm.conn.Query(query)

	defer rows.Close()

	if rows.Next() {
		rows.Scan(&resultsCount)
	}

	return resultsCount > 0
}

func (pm *ProjectRepository) AddMemberToProject(projectID string, userID string) error {

	_, getProjectErr := pm.getProjectByID(projectID)

	if getProjectErr != nil {
		return getProjectErr
	}

	_, getUserErr := pm.um.GetUserByID(userID)

	if getUserErr != nil {
		return getUserErr
	}

	if pm.memberIsInProject(projectID, userID) {
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
