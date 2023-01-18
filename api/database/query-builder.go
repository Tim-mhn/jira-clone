package database

import sq "github.com/Masterminds/squirrel"

func GetPsqlQueryBuilder() sq.StatementBuilderType {
	return sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
}
