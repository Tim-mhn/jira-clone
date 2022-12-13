package repositories

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/models"
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

func (taskStatusRepo TaskStatusRepository) GetAllStatus() ([]models.TaskStatus, error) {
	request := "SELECT id, label from task_status"

	rows, err := taskStatusRepo.conn.Query(request)

	statusList := []models.TaskStatus{}

	if err != nil {
		return statusList, err
	}

	defer rows.Close()

	for rows.Next() {
		var status models.TaskStatus

		rows.Scan(&status.Id, &status.Label)

		statusList = append(statusList, status)
	}

	return statusList, nil
}
