package task_type

import (
	"database/sql"

	sq "github.com/Masterminds/squirrel"
)

type TaskTypeRepository struct {
	conn *sql.DB
}

func NewTaskTypeRepository(conn *sql.DB) *TaskTypeRepository {
	repo := TaskTypeRepository{
		conn: conn,
	}

	return &repo
}

func (repo TaskTypeRepository) GetAllTaskTypes() ([]TaskType, error) {
	builder := sq.Select("id", "label", "color", "icon").From("task_type")

	rows, err := builder.RunWith(repo.conn).Query()

	var typeList []TaskType

	if err != nil {
		return typeList, err
	}

	defer rows.Close()

	for rows.Next() {
		var taskType TaskType

		rows.Scan(&taskType.Id, &taskType.Label, &taskType.Color, &taskType.Icon)

		typeList = append(typeList, taskType)
	}

	return typeList, nil
}
