package tasks_repositories

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
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

func (taskRepo TaskQueriesRepository) GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]tasks_models.Task, error) {

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

	elapsed := time.Since(start).Milliseconds()
	fmt.Println("-----")
	fmt.Printf(`GetSprintTasks took %d ms`, elapsed)
	fmt.Println("-----")
	return tasks, nil
}

func getTaskDataFromRow(rows *sql.Rows) (tasks_models.Task, error) {
	var task tasks_models.Task
	var assignee auth.User
	var assigneeIdBytes []byte // handle potential null values

	err := rows.Scan(
		&task.Id, &task.Title, &task.Points, &task.Description,
		&task.Status.Id, &task.Status.Label, &task.Status.Color,
		&assigneeIdBytes, &assignee.Name, &assignee.Email, &task.Key)

	if err != nil {
		return tasks_models.Task{}, err
	}

	task.Assignee = assignee
	assigneeIdString := string(assigneeIdBytes)
	task.Assignee = auth.BuildUserWithIcon(assigneeIdString, task.Assignee.Name, task.Assignee.Email)

	return task, nil

}

func (taskRepo *TaskQueriesRepository) GetTaskById(taskID string) (tasks_models.Task, error) {
	singleTaskQueryBuilder := singleTaskByIdQueryBuilder(taskID)

	rows, err := singleTaskQueryBuilder.RunWith(taskRepo.conn).Query()

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
		"CONCAT(project.key, '-', task.number) as task_key").
		From("task").
		LeftJoin(`"user" ON assignee_id="user".id`).
		LeftJoin("task_status ON task_status.id=task.status").
		LeftJoin("sprint ON sprint.id=task.sprint_id").
		LeftJoin("project ON sprint.project_id=project.id")

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
