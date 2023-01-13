package tasks_repositories

import (
	"database/sql"

	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type TaskStatusRepository struct {
	conn *sql.DB
}

func NewTaskStatusRepository(conn *sql.DB) *TaskStatusRepository {
	taskStatusRepo := TaskStatusRepository{
		conn: conn,
	}

	return &taskStatusRepo
}

func (taskStatusRepo TaskStatusRepository) GetAllStatus() ([]tasks_models.TaskStatus, error) {
	request := "SELECT id, label, color from task_status ORDER BY id"

	rows, err := taskStatusRepo.conn.Query(request)

	statusList := []tasks_models.TaskStatus{}

	if err != nil {
		return statusList, err
	}

	defer rows.Close()

	for rows.Next() {
		var status tasks_models.TaskStatus

		rows.Scan(&status.Id, &status.Label, &status.Color)

		statusList = append(statusList, status)
	}

	return statusList, nil
}
