package repositories

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/tim-mhn/figma-clone/models"
	"github.com/tim-mhn/figma-clone/utils"
)

type TaskQueriesRepository struct {
	um   *UserRepository
	pm   *ProjectRepository
	conn *sql.DB
}

func NewTaskQueriesRepository(um *UserRepository, pm *ProjectRepository, conn *sql.DB) *TaskQueriesRepository {
	taskRepo := TaskQueriesRepository{}
	taskRepo.um = um
	taskRepo.pm = pm
	taskRepo.conn = conn

	return &taskRepo
}

func addContextToError(contextErrorMessage string, sourceError error) error {
	return fmt.Errorf(`%s Details: %s `, contextErrorMessage, sourceError.Error())
}

func (taskRepo TaskQueriesRepository) GetSprintTasks(sprintID string) ([]models.Task, error) {

	BASE_ERROR_MESSAGE := fmt.Sprintf(`error  when fetching list of tasks of sprint %s`, sprintID)

	tasksOfProjectQuery := buildGetTasksOfSprintQuery(sprintID)

	log.Printf(`[GetProjectTasks] SQL Query: %s`, tasksOfProjectQuery)

	rows, err := taskRepo.conn.Query(tasksOfProjectQuery)

	if err != nil {

		return []models.Task{}, addContextToError(BASE_ERROR_MESSAGE, err)
	}

	defer rows.Close()

	tasks := []models.Task{}

	for rows.Next() {

		task, err := getTaskDataFromRow(rows)

		if err != nil {
			return []models.Task{}, addContextToError(BASE_ERROR_MESSAGE, err)
		}

		tasks = append(tasks, task)

	}

	return tasks, nil
}

func getTaskDataFromRow(rows *sql.Rows) (models.Task, error) {
	var task models.Task
	var assignee models.User
	var assigneeIdBytes []byte // handle potential null values

	err := rows.Scan(
		&task.Id, &task.Title, &task.Points, &task.Description,
		&task.Status.Id, &task.Status.Label,
		&assigneeIdBytes, &assignee.Name, &assignee.Email)

	if err != nil {
		return models.Task{}, err
	}

	task.Assignee = assignee
	assigneeIdString := string(assigneeIdBytes)
	task.Assignee = utils.BuildUserWithIcon(assigneeIdString, task.Assignee.Name, task.Assignee.Email)

	return task, nil

}

func (taskRepo *TaskQueriesRepository) GetTaskById(taskID string) (models.Task, error) {
	getTaskRequest := buildSingleTaskQuery(taskID)

	rows, err := taskRepo.conn.Query(getTaskRequest)

	if err != nil {
		return models.Task{}, addContextToError(fmt.Sprintf(`error when querying task %s `, taskID), err)
	}

	defer rows.Close()

	if !rows.Next() {
		return models.Task{}, fmt.Errorf(`no data found for task %s`, taskID)
	}

	task, err := getTaskDataFromRow(rows)

	if err != nil {
		return models.Task{}, err
	}

	return task, nil

}

const TASK_REQUEST string = `SELECT task.id as task_id, 
	task.title as task_title,
	task.points as task_points,
	task.description as task_description,
	COALESCE(task.status, 0) as task_status,
	COALESCE(task_status.label, '') as task_status_label,
	assignee_id,
	COALESCE("user".name, '') as user_name,
	COALESCE("user".email, '') as user_email
	from task
	LEFT JOIN "user" ON assignee_id="user".id
	LEFT JOIN task_status ON task_status.id=task.status`

func buildGetTasksOfSprintQuery(sprintID string) string {
	return fmt.Sprintf(`%s WHERE task.sprint_id='%s'`, TASK_REQUEST, sprintID)
}

func buildSingleTaskQuery(taskID string) string {
	return fmt.Sprintf(`%s WHERE task.id='%s' LIMIT 1 `, TASK_REQUEST, taskID)
}
