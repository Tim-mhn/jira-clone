package repositories

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/tim-mhn/figma-clone/dtos"
	"github.com/tim-mhn/figma-clone/models"
)

type TaskCommandsRepository struct {
	um   *UserRepository
	pm   *ProjectRepository
	conn *sql.DB
}

func NewTaskCommandsRepository(um *UserRepository, pm *ProjectRepository, conn *sql.DB) *TaskCommandsRepository {
	taskRepo := TaskCommandsRepository{}
	taskRepo.um = um
	taskRepo.pm = pm
	taskRepo.conn = conn

	return &taskRepo
}

func (taskRepo *TaskCommandsRepository) CreateTask(projectID string, sprintID string, title string, assigneeID string, points int, description string) (string, error) {

	log.Printf("create task called")

	_, getProjectErr := taskRepo.pm.GetProjectByID(projectID)

	if getProjectErr != nil {
		return "", getProjectErr
	}

	assignationError := taskRepo.checkCanAssignTaskToMember(projectID, assigneeID)

	if assignationError != nil {
		return "", assignationError
	}

	createTaskQuery := fmt.Sprintf(`
		INSERT INTO task (title, points, sprint_id, assignee_id, description, status) 
		VALUES ('%s', '%d', '%s', '%s', '%s', %d)
		RETURNING id
	`, title, points, sprintID, assigneeID, description, models.NEW_STATUS)

	log.Printf(`[CreateTask] SQL Query: %s`, createTaskQuery)
	rows, err := taskRepo.conn.Query(createTaskQuery)

	if err != nil {
		return "", err
	}

	defer rows.Close()

	var taskID string
	if rows.Next() {
		err := rows.Scan(&taskID)

		if err != nil {
			return "", err
		}
	}

	return taskID, nil
}

func (taskRepo *TaskCommandsRepository) checkCanAssignTaskToMember(taskProjectId string, memberId string) error {

	noAssignee := memberId == ""
	if noAssignee {
		return nil
	}
	isInProject, err := taskRepo.pm.MemberIsInProject(taskProjectId, memberId)

	if err != nil {
		return err
	}

	if !isInProject {
		return fmt.Errorf("assignee is not in project")

	}

	return nil
}

func (taskRepo *TaskCommandsRepository) UpdateTask(taskID string, patchDTO dtos.PatchTaskDTO) error {

	ApiToDBFields := map[string]string{
		"AssigneeId":  "assignee_id",
		"Status":      "status",
		"Description": "description",
		"Title":       "title",
		"Points":      "points",
	}

	updateQuery := buildSQLUpdateQuery(patchDTO, ApiToDBFields, SQLCondition{
		field: "id",
		value: fmt.Sprintf(`'%s'`, taskID),
	})

	_, err := taskRepo.conn.Exec(updateQuery)

	if err != nil {
		log.Printf(`Error in TaskCommandsRepository.UpdateTask: %s`, err.Error())
	}
	return err

}

type DeleteTaskResponse struct {
	NotFound bool
}

func (taskRepo *TaskCommandsRepository) DeleteTask(taskID string) (DeleteTaskResponse, error) {
	deleteQuery := fmt.Sprintf(`DELETE FROM task WHERE task.id='%s'`, taskID)

	res, err := taskRepo.conn.Exec(deleteQuery)

	if err != nil {
		return DeleteTaskResponse{}, err
	}

	rowsAffectedCount, err := res.RowsAffected()

	if rowsAffectedCount == 0 {
		return DeleteTaskResponse{
			NotFound: true,
		}, nil
	}
	return DeleteTaskResponse{}, err
}
