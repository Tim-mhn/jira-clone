package search

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tasks_queries "github.com/tim-mhn/figma-clone/modules/tasks/queries"
)

type DBSearchTasksRepository struct {
	conn *sql.DB
}

func NewSearchTasksRepository(conn *sql.DB) SearchTasksRepository {
	return &DBSearchTasksRepository{
		conn: conn,
	}
}

func (taskRepo *DBSearchTasksRepository) SearchTasksWithMatchingContentInUserProjects(input SearchInput) ([]tasks_models.TaskInfo, error) {

	builder := getSQLBuilder(UserID(input.UserID), SearchText(input.Text))

	fmt.Print(builder.ToSql())
	rows, err := builder.RunWith(taskRepo.conn).Query()

	if err != nil {
		return []tasks_models.TaskInfo{}, err
	}

	defer rows.Close()

	taskPersistenceList, err := getTaskInfoListFromSQLRows(rows)

	if err != nil {
		return []tasks_models.TaskInfo{}, err
	}

	taskInfoList := buildTaskInfoListFromPersistenceData(taskPersistenceList)

	return taskInfoList, err
}

func getTaskInfoListFromSQLRows(rows *sql.Rows) ([]tasks_queries.TaskInfoPersistenceModel, error) {
	var taskList []tasks_queries.TaskInfoPersistenceModel
	for rows.Next() {

		var task tasks_queries.TaskInfoPersistenceModel
		err := rows.Scan(&task.Id, &task.Raw_title, &task.Points, &task.Description, &task.Project_key, &task.Task_number, &task.Project_name, &task.Project_id)
		if err != nil {
			return []tasks_queries.TaskInfoPersistenceModel{}, err
		}

		taskList = append(taskList, task)

	}

	return taskList, nil
}

func buildTaskInfoListFromPersistenceData(taskPersistenceList []tasks_queries.TaskInfoPersistenceModel) []tasks_models.TaskInfo {
	var tasks []tasks_models.TaskInfo
	for _, dbTask := range taskPersistenceList {
		taskInfo := tasks_queries.BuildTaskInfoFromPersistenceData(dbTask)
		tasks = append(tasks, taskInfo)
	}
	return tasks
}

//todo: check if we should not move this into task-queries.repo for SRP ?
func getSQLBuilder(userID UserID, searchText SearchText) sq.SelectBuilder {
	searchPattern := "%" + searchText + "%"

	psql := database.GetPsqlQueryBuilder()

	return psql.Select("task.id",
		"title",
		"points",
		"description",
		"project.key as project_key",
		"task.number as task_number",
		"project.name as project_name",
		"project.id as project_id").
		From("task").
		LeftJoin("sprint ON task.sprint_id=sprint.id").
		LeftJoin("project ON sprint.project_id=project.id").
		LeftJoin("project_user ON project.id=project_user.project_id").
		Where(sq.Eq{
			"project_user.user_id": userID,
		}).
		Where(sq.Or{
			sq.ILike{
				"title": searchPattern,
			},
			sq.ILike{
				"description": searchPattern,
			},
		}).
		Limit(15)
}
