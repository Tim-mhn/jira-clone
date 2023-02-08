package search

import (
	"database/sql"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
)

type SearchSprintsRepository struct {
	conn *sql.DB
}

func NewSearchSprintsRepository(conn *sql.DB) *SearchSprintsRepository {
	return &SearchSprintsRepository{
		conn: conn,
	}
}

func (repo *SearchSprintsRepository) SearchSprintOfUsersByName(searchInput SearchInput) ([]SprintInfo, error) {

	query := searchSprintsQuery(searchInput)

	rows, err := query.RunWith(repo.conn).Query()

	if err != nil {
		return []SprintInfo{}, err
	}

	defer rows.Close()

	var sprints []SprintInfo

	for rows.Next() {
		var sprint SprintInfo
		err := rows.Scan(&sprint.Id, &sprint.Name, &sprint.Project.Id, &sprint.Project.Name)

		if err != nil {
			return []SprintInfo{}, err
		}
		sprints = append(sprints, sprint)
	}

	return sprints, nil

}

func searchSprintsQuery(searchInput SearchInput) sq.SelectBuilder {
	searchPattern := "%" + searchInput.Text + "%"

	psql := database.GetPsqlQueryBuilder()
	query := psql.Select("sprint.id", "sprint.name", "project.id", "project.name").
		From("sprint").
		LeftJoin("project ON sprint.project_id=project.id").
		LeftJoin("project_user ON project.id=project_user.project_id").
		Where(
			sq.And{
				sq.Eq{"project_user.user_id": searchInput.UserID},
				sq.ILike{
					"sprint.name": searchPattern,
				},
				sq.Eq{"sprint.deleted": false},
			},
		).
		Limit(15)

	return query
}
