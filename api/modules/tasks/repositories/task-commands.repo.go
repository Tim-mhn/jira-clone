package tasks_repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	"github.com/tim-mhn/figma-clone/shared"
)

type TaskCommandsRepository interface {
	CreateTask(projectID string, sprintID string, title string, assigneeID string, points int, description string) (tasks_models.Task, error)
	UpdateTaskData(taskID string, patchDTO tasks_dtos.PatchTaskDTO) error
	DeleteTask(taskID string) (DeleteTaskResponse, error)
}
type SQLTaskCommandsRepository struct {
	um             auth.UserRepository
	projectQueries project.ProjectRepository
	conn           *sql.DB
}

func NewSQLTaskCommandsRepository(um auth.UserRepository, projectQueries project.ProjectRepository, conn *sql.DB) *SQLTaskCommandsRepository {
	taskRepo := SQLTaskCommandsRepository{}
	taskRepo.um = um
	taskRepo.projectQueries = projectQueries
	taskRepo.conn = conn

	return &taskRepo
}

func (taskRepo *SQLTaskCommandsRepository) CreateTask(projectID string, sprintID string, title string, assigneeID string, points int, description string) (tasks_models.Task, error) {

	log.Printf("create task called")

	_, getProjectErr := taskRepo.projectQueries.GetProjectByID(projectID)

	if getProjectErr != nil {
		return tasks_models.Task{}, getProjectErr
	}

	assignationError := taskRepo.checkCanAssignTaskToMember(projectID, assigneeID)

	if assignationError != nil {
		return tasks_models.Task{}, assignationError
	}

	createTaskQuery := buildCreateTaskQuery(projectID, sprintID, title, assigneeID, points, description)
	log.Printf(`[CreateTask] SQL Query: %s`, createTaskQuery)
	rows, err := taskRepo.conn.Query(createTaskQuery)

	if err != nil {
		return tasks_models.Task{}, err
	}

	defer rows.Close()

	newTask := tasks_models.Task{
		Points:      points,
		Title:       &title,
		Description: &description,
	}

	if rows.Next() {
		err := rows.Scan(&newTask.Id)

		if err != nil {
			return tasks_models.Task{}, err
		}
	}

	return newTask, nil
}

func buildCreateTaskQuery(projectID string, sprintID string, title string, assigneeID string, points int, description string) string {
	return fmt.Sprintf(`
		WITH insert_task AS (
    WITH task_number AS (
		SELECT COALESCE(MAX(number) + 1, 1) as next_number
		FROM task
		JOIN sprint ON task.sprint_id=sprint.id
		JOIN project ON sprint.project_id=project.id
		WHERE project.id='%s'    )
    INSERT INTO task (title, points, sprint_id, assignee_id, description, status, number) 
    SELECT '%s', %d, '%s', '%s', '%s', %d, task_number.next_number
    FROM  task_number 
    RETURNING id
),
positions AS (
SELECT MAX(position) + 1 as next_position
FROM task
JOIN task_position ON task.id=task_position.task_id
WHERE task.sprint_id='%s'
)
INSERT INTO task_position (position, task_id)
SELECT COALESCE(positions.next_position, 0), id
FROM insert_task
JOIN positions ON true
RETURNING task_id as id `, projectID, title, points, sprintID, assigneeID, description, tasks_models.NEW_STATUS, sprintID)
}

func (taskRepo *SQLTaskCommandsRepository) checkCanAssignTaskToMember(taskProjectId string, memberId string) error {

	noAssignee := memberId == ""
	if noAssignee {
		return nil
	}
	isInProject, err := taskRepo.projectQueries.MemberIsInProject(taskProjectId, memberId)

	if err != nil {
		return err
	}

	if !isInProject {
		return fmt.Errorf("assignee is not in project")

	}

	return nil
}

func (taskRepo *SQLTaskCommandsRepository) UpdateTaskData(taskID string, patchDTO tasks_dtos.PatchTaskDTO) error {

	ApiToDBFields := map[string]string{
		"assigneeId":  "assignee_id",
		"status":      "status",
		"description": "description",
		"title":       "title",
		"points":      "points",
		"sprintId":    "sprint_id",
		"type":        "task_type",
	}

	patchBytes, _ := json.Marshal(&patchDTO)
	var patchJSON map[string]interface{}
	_ = json.Unmarshal(patchBytes, &patchJSON)

	updateQuery := shared.BuildSQLUpdateQuery("task", patchJSON, ApiToDBFields, shared.SQLCondition{
		Field: "id",
		Value: taskID,
	})

	_, err := updateQuery.RunWith(taskRepo.conn).Exec()

	if err != nil {
		log.Printf(`Error in SQLTaskCommandsRepository.UpdateTask: %s`, err.Error())
	}
	return err

}

type DeleteTaskResponse struct {
	NotFound bool
}

func (taskRepo *SQLTaskCommandsRepository) DeleteTask(taskID string) (DeleteTaskResponse, error) {
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
