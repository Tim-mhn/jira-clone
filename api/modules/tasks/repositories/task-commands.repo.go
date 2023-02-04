package tasks_repositories

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_dtos "github.com/tim-mhn/figma-clone/modules/tasks/dtos"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	"github.com/tim-mhn/figma-clone/shared"
)

type TaskCommandsRepository struct {
	um             *auth.UserRepository
	projectQueries *project.ProjectQueriesRepository
	conn           *sql.DB
}

func NewTaskCommandsRepository(um *auth.UserRepository, projectQueries *project.ProjectQueriesRepository, conn *sql.DB) *TaskCommandsRepository {
	taskRepo := TaskCommandsRepository{}
	taskRepo.um = um
	taskRepo.projectQueries = projectQueries
	taskRepo.conn = conn

	return &taskRepo
}

func (taskRepo *TaskCommandsRepository) CreateTask(projectID string, sprintID string, title string, assigneeID string, points int, description string) (tasks_models.Task, error) {

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
		SELECT MAX(number) + 1 as next_number
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

func (taskRepo *TaskCommandsRepository) checkCanAssignTaskToMember(taskProjectId string, memberId string) error {

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

func (taskRepo *TaskCommandsRepository) UpdateTask(taskID string, patchDTO tasks_dtos.PatchTaskDTO) error {

	ApiToDBFields := map[string]string{
		"AssigneeId":  "assignee_id",
		"Status":      "status",
		"Description": "description",
		"Title":       "title",
		"Points":      "points",
		"SprintId":    "sprint_id",
		"Type":        "task_type",
	}

	updateQuery := shared.BuildSQLUpdateQuery(patchDTO, ApiToDBFields, shared.SQLCondition{
		Field: "id",
		Value: fmt.Sprintf(`'%s'`, taskID),
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
