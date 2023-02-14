package tags

import (
	"database/sql"

	sq "github.com/Masterminds/squirrel"
	"github.com/lib/pq"
	"github.com/tim-mhn/figma-clone/database"
)

type TagsRepository struct {
	conn *sql.DB
}

func newTagsRepository(conn *sql.DB) TagsRepository {
	return TagsRepository{
		conn: conn,
	}
}

func (repo TagsRepository) UpdateTaskTags(taskID string, tags []TaskTag) error {

	/**
	* - tags := extractTags(title)
	* - repo.updateTaskTags(id, tags)
	 */

	psql := database.GetPsqlQueryBuilder()
	query := psql.
		Update("task_tags").
		Set("tags", pq.StringArray(tags)).
		Where(sq.Eq{
			"task_id": taskID,
		})

	res, err := query.RunWith(repo.conn).Exec()

	if err != nil {
		return err
	}

	noTags, err := _taskHasNoTags(res)

	if err != nil {
		return err
	}

	if noTags {
		return repo._insertTaskTagsForFirstTime(taskID, tags)
	}

	return nil
}

func _taskHasNoTags(res sql.Result) (bool, error) {
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return false, err
	}

	return rowsAffected == 0, nil
}

func (repo TagsRepository) _insertTaskTagsForFirstTime(taskID string, tags []TaskTag) error {

	psql := database.GetPsqlQueryBuilder()

	insertQuery := psql.
		Insert("task_tags").
		Columns("task_id", "tags").
		Values(taskID, pq.StringArray(tags))

	_, err := insertQuery.RunWith(repo.conn).Exec()

	return err
}

func (repo TagsRepository) getProjectTags(projectID string) ([]TaskTag, error) {
	psql := database.GetPsqlQueryBuilder()

	query := psql.Select("tag").From("project_tags").Where(sq.Eq{
		"project_id": projectID,
	})

	rows, err := query.RunWith(repo.conn).Query()

	if err != nil {
		return []TaskTag{}, err
	}

	defer rows.Close()

	var taskTags []TaskTag = []TaskTag{}

	for rows.Next() {
		var tag TaskTag
		if err := rows.Scan(&tag); err != nil {
			return []TaskTag{}, err
		}

		taskTags = append(taskTags, tag)
	}

	return taskTags, nil

}

func (repo TagsRepository) createTagForProject(tag TaskTag, projectID string) error {
	psql := database.GetPsqlQueryBuilder()

	insertQuery := psql.Insert("project_tags").
		Columns("project_id", "tag").
		Values(projectID, tag)

	_, err := insertQuery.RunWith(repo.conn).Exec()

	return err
}
