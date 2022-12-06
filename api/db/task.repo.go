package db

import (
	"database/sql"
	"fmt"

	"github.com/tim-mhn/figma-clone/models"
)

type TaskRepository struct {
	tasks []models.Task
	um    *UserRepository
	pm    *ProjectRepository
	conn  *sql.DB
}

func NewTaskRepository(um *UserRepository, pm *ProjectRepository, conn *sql.DB) *TaskRepository {
	taskRepo := TaskRepository{}
	taskRepo.um = um
	taskRepo.pm = pm
	// taskRepo.tasks = []models.Task{}
	// taskRepo.lastTaskID = 0
	taskRepo.conn = conn

	return &taskRepo
}

func (taskRepo TaskRepository) GetAllTasks() []models.Task {
	return taskRepo.tasks
}

func (taskRepo *TaskRepository) GetTaskById(taskID string) (models.Task, error) {
	getTaskRequest := fmt.Sprintf(`
	SELECT task.id as task_id, 
	task.title as task_title,
	task.points as task_points,
	task.description as task_description,
	"user".id as user_id, 
	"user".name as user_name, 
	"user".email as user_email 
	from task 
	INNER JOIN "user" ON assignee_id="user".id
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
	var dsc string
	if rows.Next() {
		err := rows.Scan(
			&task.Id, &task.Title, &task.Points, &dsc,
			&assignee.Id, &assignee.Name, &assignee.Email)

		if err != nil {
			return models.Task{}, err
		}
	}

	task.Assignee = assignee

	fmt.Println(task)

	return task, nil

}

func (taskRepo *TaskRepository) CreateTask(points int, title string, assigneeID string, projectID string) (string, error) {
	_, getUserErr := taskRepo.um.GetUserByID(assigneeID)
	if getUserErr != nil {
		return "", getUserErr
	}

	_, getProjectErr := taskRepo.pm.getProjectByID(projectID)

	if getProjectErr != nil {
		return "", getProjectErr
	}

	if !taskRepo.pm.memberIsInProject(projectID, assigneeID) {
		return "", fmt.Errorf("assignee is not in project")
	}

	createTaskQuery := fmt.Sprintf(`
		INSERT INTO task (title, points, project_id, assignee_id, description) 
		VALUES ('%s', '%d', '%s', '%s', '')
		RETURNING id
	`, title, points, projectID, assigneeID)

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
