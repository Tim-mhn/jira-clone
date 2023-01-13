package tasks_repositories

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/tim-mhn/figma-clone/modules/auth"
	"github.com/tim-mhn/figma-clone/modules/project"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type TaskQueriesRepository struct {
	um   *auth.UserRepository
	pm   *project.ProjectRepository
	conn *sql.DB
}

func NewTaskQueriesRepository(um *auth.UserRepository, pm *project.ProjectRepository, conn *sql.DB) *TaskQueriesRepository {
	taskRepo := TaskQueriesRepository{}
	taskRepo.um = um
	taskRepo.pm = pm
	taskRepo.conn = conn

	return &taskRepo
}

func addContextToError(contextErrorMessage string, sourceError error) error {
	return fmt.Errorf(`%s Details: %s `, contextErrorMessage, sourceError.Error())
}

func (taskRepo TaskQueriesRepository) GetSprintTasks(sprintID string) ([]tasks_models.Task, error) {

	BASE_ERROR_MESSAGE := fmt.Sprintf(`error  when fetching list of tasks of sprint %s`, sprintID)

	tasksOfProjectQuery := buildGetTasksOfSprintQuery(sprintID)

	log.Printf(`[GetProjectTasks] SQL Query: %s`, tasksOfProjectQuery)

	rows, err := taskRepo.conn.Query(tasksOfProjectQuery)

	if err != nil {

		return []tasks_models.Task{}, addContextToError(BASE_ERROR_MESSAGE, err)
	}

	defer rows.Close()

	tasks := []tasks_models.Task{}

	for rows.Next() {

		task, err := getTaskDataFromRow(rows)

		if err != nil {
			return []tasks_models.Task{}, addContextToError(BASE_ERROR_MESSAGE, err)
		}

		tasks = append(tasks, task)

	}

	return tasks, nil
}

func getTaskDataFromRow(rows *sql.Rows) (tasks_models.Task, error) {
	var task tasks_models.Task
	var assignee auth.User
	var assigneeIdBytes []byte // handle potential null values

	err := rows.Scan(
		&task.Id, &task.Title, &task.Points, &task.Description,
		&task.Status.Id, &task.Status.Label, &task.Status.Color,
		&assigneeIdBytes, &assignee.Name, &assignee.Email)

	if err != nil {
		return tasks_models.Task{}, err
	}

	task.Assignee = assignee
	assigneeIdString := string(assigneeIdBytes)
	task.Assignee = auth.BuildUserWithIcon(assigneeIdString, task.Assignee.Name, task.Assignee.Email)

	return task, nil

}

func (taskRepo *TaskQueriesRepository) GetTaskById(taskID string) (tasks_models.Task, error) {
	getTaskRequest := buildSingleTaskQuery(taskID)

	rows, err := taskRepo.conn.Query(getTaskRequest)

	if err != nil {
		return tasks_models.Task{}, addContextToError(fmt.Sprintf(`error when querying task %s `, taskID), err)
	}

	defer rows.Close()

	if !rows.Next() {
		return tasks_models.Task{}, fmt.Errorf(`no data found for task %s`, taskID)
	}

	task, err := getTaskDataFromRow(rows)

	if err != nil {
		return tasks_models.Task{}, err
	}

	return task, nil

}

const TASK_REQUEST string = `SELECT task.id as task_id, 
	task.title as task_title,
	task.points as task_points,
	task.description as task_description,
	COALESCE(task.status, 0) as task_status,
	COALESCE(task_status.label, '') as task_status_label,
	task_status.color as task_status_color,
	assignee_id,
	COALESCE("user".name, '') as user_name,
	COALESCE("user".email, '') as user_email
	from task
	LEFT JOIN "user" ON assignee_id="user".id
	LEFT JOIN task_status ON task_status.id=task.status
	`

func buildGetTasksOfSprintQuery(sprintID string) string {
	return fmt.Sprintf(`%s LEFT JOIN task_position ON task_position.task_id=task.id WHERE task.sprint_id='%s' ORDER BY task_position.position ASC`, TASK_REQUEST, sprintID)
}

func buildSingleTaskQuery(taskID string) string {
	return fmt.Sprintf(`%s WHERE task.id='%s' LIMIT 1 `, TASK_REQUEST, taskID)
}
