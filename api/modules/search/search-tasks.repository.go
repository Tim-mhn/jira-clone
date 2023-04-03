package search

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
)

type DBSearchTasksRepository struct {
	conn *sql.DB
}

func NewSearchTasksRepository(conn *sql.DB) SearchTasksRepository {
	return &DBSearchTasksRepository{
		conn: conn,
	}
}

func (taskRepo *DBSearchTasksRepository) SearchTasksWithMatchingContentInUserProjects(input SearchInput) ([]TaskInfo, error) {

	builder := getSQLBuilder(UserID(input.UserID), SearchText(input.Text))

	fmt.Print(builder.ToSql())
	rows, err := builder.RunWith(taskRepo.conn).Query()

	if err != nil {
		return []TaskInfo{}, err
	}

	defer rows.Close()

	taskList, err := getTaskInfoListFromSQLRows(rows)

	if err != nil {
		return []TaskInfo{}, err
	}

	return taskList, err
}

func getTaskInfoListFromSQLRows(rows *sql.Rows) ([]TaskInfo, error) {
	var taskList []TaskInfo
	for rows.Next() {

		var task TaskInfo
		var projectInfo ProjectInfo
		err := rows.Scan(&task.Id, &task.Title, &task.Points, &task.Description, &task.Key, &projectInfo.Name, &projectInfo.Id)
		task.Title = tags.RemoveTagsFromTaskTitle(task.Title)
		if err != nil {
			return []TaskInfo{}, err
		}

		task.Project = projectInfo
		taskList = append(taskList, task)

	}

	return taskList, nil
}

func getSQLBuilder(userID UserID, searchText SearchText) sq.SelectBuilder {
	searchPattern := "%" + searchText + "%"

	psql := database.GetPsqlQueryBuilder()

	return psql.Select("task.id",
		"title",
		"points",
		"description",
		"CONCAT(project.key, '-', task.number) as task_key",
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
