package repositories

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

type TaskRepository struct {
	um   *UserRepository
	pm   *ProjectRepository
	conn *sql.DB
}

func NewTaskRepository(um *UserRepository, pm *ProjectRepository, conn *sql.DB) *TaskRepository {
	taskRepo := TaskRepository{}
	taskRepo.um = um
	taskRepo.pm = pm
	taskRepo.conn = conn

	return &taskRepo
}

func (taskRepo TaskRepository) GetProjectTasks(projectID string) ([]models.Task, error) {

	getProjectTasksRequest := fmt.Sprintf(`
	SELECT task.id as task_id, 
	task.title as task_title,
	task.points as task_points,
	task.description as task_description,
	task.status as task_status,
	task_status.label as task_status_label,
	"user".id as user_id, 
	"user".name as user_name, 
	"user".email as user_email 
	from task 
	INNER JOIN "user" ON assignee_id="user".id
	INNER JOIN task_status ON task_status.id=task.status
	WHERE task.project_id='%s' 
	`, projectID)

	tasks := []models.Task{}

	rows, err := taskRepo.conn.Query(getProjectTasksRequest)

	if err != nil {
		return []models.Task{}, err
	}

	defer rows.Close()

	for rows.Next() {

		var task models.Task
		var assignee models.User
		err := rows.Scan(
			&task.Id, &task.Title, &task.Points, &task.Description,
			&task.Status.Id, &task.Status.Label,
			&assignee.Id, &assignee.Name, &assignee.Email)

		if err != nil {
			return []models.Task{}, err
		}

		task.Assignee = assignee

		tasks = append(tasks, task)
	}

	return tasks, nil
}

func (taskRepo *TaskRepository) GetTaskById(taskID string) (models.Task, error) {
	getTaskRequest := fmt.Sprintf(`
	SELECT task.id as task_id, 
	task.title as task_title,
	task.points as task_points,
	task.description as task_description,
	task.status as task_status,
	task_status.label as task_status_label,
	"user".id as user_id, 
	"user".name as user_name, 
	"user".email as user_email 
	from task 
	INNER JOIN "user" ON assignee_id="user".id
	INNER JOIN task_status ON task_status.id=task.status
	WHERE task.id='%s' 
	LIMIT 1 
	`, taskID)

	rows, err := taskRepo.conn.Query(getTaskRequest)

	if err != nil {
		return models.Task{}, err
	}

	defer rows.Close()

	var task models.Task
	var assignee models.User
	if rows.Next() {
		err := rows.Scan(
			&task.Id, &task.Title, &task.Points, &task.Description,
			&task.Status.Id, &task.Status.Label,
			&assignee.Id, &assignee.Name, &assignee.Email)

		if err != nil {
			return models.Task{}, err
		}
	}

	task.Assignee = assignee

	return task, nil

}

func (taskRepo *TaskRepository) CreateTask(projectID string, title string, assigneeID string, points int, description string) (string, error) {
	_, getUserErr := taskRepo.um.GetUserByID(assigneeID)
	if getUserErr != nil {
		return "", getUserErr
	}

	_, getProjectErr := taskRepo.pm.getProjectByID(projectID)

	if getProjectErr != nil {
		return "", getProjectErr
	}

	if !taskRepo.pm.MemberIsInProject(projectID, assigneeID) {
		return "", fmt.Errorf("assignee is not in project")
	}

	createTaskQuery := fmt.Sprintf(`
		INSERT INTO task (title, points, project_id, assignee_id, description, status) 
		VALUES ('%s', '%d', '%s', '%s', '%s', %d)
		RETURNING id
	`, title, points, projectID, assigneeID, description, models.NEW_STATUS)

	rows, err := taskRepo.conn.Query(createTaskQuery)

	if err != nil {
		return "", err
	}

	defer rows.Close()

	var taskID string
	if rows.Next() {
		rows.Scan(&taskID)
	}

	return taskID, nil
}

type PatchTaskDTO struct {
	Status     *int    `json:"status,omitempty"`
	AssigneeId *string `json:"assigneeId,omitempty`
}

func (dto PatchTaskDTO) String() string {
	return fmt.Sprintf(`status: %d -- assigneeId: %s`, dto.Status, *dto.AssigneeId)
}

func (taskRepo *TaskRepository) UpdateTaskStatus(taskID string, patchDTO PatchTaskDTO) error {

	ApiToDBFields := map[string]string{
		"AssigneeId": "assignee_id",
		"Status":     "status",
	}

	updateQuery := buildSQLUpdateQuery(patchDTO, ApiToDBFields, SQLCondition{
		field: "id",
		value: fmt.Sprintf(`'%s'`, taskID),
	})

	fmt.Println(updateQuery)
	_, err := taskRepo.conn.Exec(updateQuery)

	return err

}
