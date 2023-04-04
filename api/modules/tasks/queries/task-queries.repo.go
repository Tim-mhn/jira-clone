package tasks_queries

import (
	"database/sql"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type TaskQueriesRepository interface {
	GetTaskByID(taskID string) (TaskPersistenceModel, tasks_errors.TaskError)
	GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]TaskPersistenceModel, error)
}
type DBTaskQueriesRepository struct {
	conn *sql.DB
}

func NewTaskQueriesRepository(conn *sql.DB) TaskQueriesRepository {
	taskRepo := DBTaskQueriesRepository{}
	taskRepo.conn = conn

	return &taskRepo
}

func getTaskDataFromRow(rows *sql.Rows) (TaskPersistenceModel, error) {
	var task TaskPersistenceModel

	var assigneeIdBytes []byte // handle potential null values
	err := rows.Scan(
		&task.id, &task.rawTitle, &task.points, &task.description,
		&task.status.Id, &task.status.Label, &task.status.Color,
		&assigneeIdBytes, &task.assignee_name, &task.assignee_email,
		&task.Type.Id, &task.Type.Label, &task.Type.Color, &task.Type.Icon,
		&task.sprint_id, &task.sprint_name,
		&task.project_key, &task.task_number)

	if err != nil {
		return TaskPersistenceModel{}, err
	}

	assigneeIdString := string(assigneeIdBytes)

	task.assignee_id = assigneeIdString

	return task, nil

}

func (taskRepo *DBTaskQueriesRepository) GetTaskByID(taskID string) (TaskPersistenceModel, tasks_errors.TaskError) {
	singleTaskQueryBuilder := singleTaskByIdQueryBuilder(taskID)

	rows, err := singleTaskQueryBuilder.RunWith(taskRepo.conn).Query()

	if err != nil {
		return TaskPersistenceModel{}, tasks_errors.BuildTaskError(tasks_errors.OtherTaskError, err)
	}

	defer rows.Close()

	if !rows.Next() {
		return TaskPersistenceModel{}, tasks_errors.BuildTaskError(tasks_errors.TaskNotFound, err)
	}

	task, err := getTaskDataFromRow(rows)

	if err != nil {
		return TaskPersistenceModel{}, tasks_errors.BuildTaskError(tasks_errors.OtherTaskError, err)

	}

	return task, tasks_errors.NoTaskError()

}

func (taskRepo *DBTaskQueriesRepository) GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]TaskPersistenceModel, error) {

	queryBuilder := tasksOfSprintsQueryBuilder(sprintID, filters)

	rows, err := queryBuilder.RunWith(taskRepo.conn).Query()

	if err != nil {
		return emptyTaskListWithError(err)
	}

	defer rows.Close()

	var tasks []TaskPersistenceModel

	for rows.Next() {
		nextTask, err := getTaskDataFromRow(rows)
		if err != nil {
			return emptyTaskListWithError(err)
		}
		tasks = append(tasks, nextTask)
	}

	return tasks, nil
}

func emptyTaskListWithError(err error) ([]TaskPersistenceModel, error) {
	return []TaskPersistenceModel{}, err
}

func tasksBaseQueryBuilder() sq.SelectBuilder {
	psql := database.GetPsqlQueryBuilder()

	selectBuilder := psql.Select(
		"task.id AS task_id",
		"title",
		"points",
		"description",
		"COALESCE(task.status, 0) as task_status",
		"COALESCE(task_status.label, '') AS task_status_label",
		"task_status.color AS task_status_color",
		"assignee_id",
		`COALESCE("user".name, '') as user_name`,
		`COALESCE("user".email, '') as user_email`,
		"task_type.id as task_type_id",
		"task_type.label as task_type_label",
		"task_type.color as task_type_color",
		"task_type.icon as task_type_icon",
		"sprint.id as sprint_id",
		"sprint.name as sprint_name",
		"project.key as project_key",
		"task.number as task_number").
		From("task").
		LeftJoin(`"user" ON assignee_id="user".id`).
		LeftJoin("task_status ON task_status.id=task.status").
		LeftJoin("sprint ON sprint.id=task.sprint_id").
		LeftJoin("project ON sprint.project_id=project.id").
		LeftJoin("task_type ON task.task_type=task_type.id")

	return selectBuilder
}

func tasksOfSprintsQueryBuilder(sprintID string, filters tasks_models.TaskFilters) sq.SelectBuilder {
	selectBuilder := tasksBaseQueryBuilder().
		LeftJoin("task_position ON task_position.task_id=task.id").
		Where(sq.Eq{"sprint_id": sprintID})

	if len(filters.AssigneeIds) > 0 {
		selectBuilder = selectBuilder.Where(sq.Eq{
			"assignee_id": filters.AssigneeIds,
		})
	}

	if len(filters.TaskStatuses) > 0 {
		selectBuilder = selectBuilder.Where(sq.Eq{
			"status": filters.TaskStatuses,
		})
	}

	if len(filters.TaskTypes) > 0 {
		selectBuilder = selectBuilder.Where(sq.Eq{
			"task_type": filters.TaskTypes,
		})
	}

	selectBuilder = selectBuilder.OrderBy("task_position.position ASC")

	return selectBuilder
}

func singleTaskByIdQueryBuilder(taskID string) sq.SelectBuilder {
	return tasksBaseQueryBuilder().Where(sq.Eq{
		"task.id": taskID,
	}).Limit(1)
}

const TASK_KEY_SQL = "CONCAT(project.key, '-', task.number) as task_key"
