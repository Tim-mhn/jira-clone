package tasks_repositories

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/modules/auth"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
)

type TaskQueriesRepository struct {
	um   *auth.UserRepository
	conn *sql.DB
}

func NewTaskQueriesRepository(um *auth.UserRepository, conn *sql.DB) *TaskQueriesRepository {
	taskRepo := TaskQueriesRepository{}
	taskRepo.um = um
	taskRepo.conn = conn

	return &taskRepo
}

func addContextToError(contextErrorMessage string, sourceError error) error {
	return fmt.Errorf(`%s Details: %s `, contextErrorMessage, sourceError.Error())
}

func (taskRepo TaskQueriesRepository) GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.TaskWithSprint, error) {

	start := time.Now()
	fmt.Print(filters)

	tasksOfSprintsQueryBuilder := tasksOfSprintsQueryBuilder(sprintID, filters)
	BASE_ERROR_MESSAGE := fmt.Sprintf(`error  when fetching list of tasks of sprint %s`, sprintID)

	sqlQuery, _, _ := tasksOfSprintsQueryBuilder.ToSql()
	log.Printf(`[GetProjectTasks] SQL Query: %s`, sqlQuery)

	startQuery := time.Now()
	rows, err := tasksOfSprintsQueryBuilder.RunWith(taskRepo.conn).Query()

	log.Printf(`tasks query took %d ms`, time.Since(startQuery).Milliseconds())
	if err != nil {

		return errorWithEmptyTaskList(addContextToError(BASE_ERROR_MESSAGE, err))
	}

	defer rows.Close()

	tasks := []tasks_models.TaskWithSprint{}

	for rows.Next() {

		task, err := getTaskDataFromRow(rows)

		if err != nil {
			return errorWithEmptyTaskList(addContextToError(BASE_ERROR_MESSAGE, err))
		}

		tasks = append(tasks, task)

	}

	elapsed := time.Since(start).Milliseconds()
	fmt.Println("-----")
	fmt.Printf(`GetSprintTasks took %d ms`, elapsed)
	fmt.Println("-----")
	return tasks, nil
}

func getTaskDataFromRow(rows *sql.Rows) (tasks_models.TaskWithSprint, error) {
	var task tasks_models.TaskWithSprint
	var taskSprint tasks_models.SprintInfo
	var assignee auth.User
	var assigneeIdBytes []byte // handle potential null values

	err := rows.Scan(
		&task.Id, &task.Title, &task.Points, &task.Description,
		&task.Status.Id, &task.Status.Label, &task.Status.Color,
		&assigneeIdBytes, &assignee.Name, &assignee.Email, &task.Key,
		&task.Type.Id, &task.Type.Label, &task.Type.Color, &task.Type.Icon,
		&taskSprint.Name, &taskSprint.Id, &taskSprint.IsBacklog)

	if err != nil {
		return tasks_models.TaskWithSprint{}, err
	}

	task.Assignee = assignee
	assigneeIdString := string(assigneeIdBytes)
	task.Assignee = auth.BuildUserWithIcon(assigneeIdString, task.Assignee.Name, task.Assignee.Email)
	task.Sprint = taskSprint

	return task, nil

}

func (taskRepo *TaskQueriesRepository) GetTaskById(taskID string) (tasks_models.TaskWithSprint, tasks_errors.TaskError) {
	singleTaskQueryBuilder := singleTaskByIdQueryBuilder(taskID)

	rows, err := singleTaskQueryBuilder.RunWith(taskRepo.conn).Query()

	if err != nil {
		return tasks_models.TaskWithSprint{}, tasks_errors.BuildTaskError(tasks_errors.OtherTaskError, err)
	}

	defer rows.Close()

	if !rows.Next() {
		return tasks_models.TaskWithSprint{}, tasks_errors.BuildTaskError(tasks_errors.TaskNotFound, err)
	}

	task, err := getTaskDataFromRow(rows)

	if err != nil {
		return tasks_models.TaskWithSprint{}, tasks_errors.BuildTaskError(tasks_errors.OtherTaskError, err)
	}

	return task, tasks_errors.NoTaskError()

}

func errorWithEmptyTaskList(err error) ([]tasks_models.TaskWithSprint, error) {
	return []tasks_models.TaskWithSprint{}, err
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
		"CONCAT(project.key, '-', task.number) as task_key",
		"task_type.id as task_type_id",
		"task_type.label as task_type_label",
		"task_type.color as task_type_color",
		"task_type.icon as task_type_icon",
		"sprint.name as sprint_name",
		"sprint.id as sprint_id",
		"sprint.is_backlog as sprint_backlog").
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

	selectBuilder = selectBuilder.OrderBy("task_position.position ASC")

	return selectBuilder
}

func singleTaskByIdQueryBuilder(taskID string) sq.SelectBuilder {
	return tasksBaseQueryBuilder().Where(sq.Eq{
		"task.id": taskID,
	}).Limit(1)
}
