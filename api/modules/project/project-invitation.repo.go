package project

import (
	"database/sql"
	"fmt"
	"math/rand"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
	strings_utils "github.com/tim-mhn/figma-clone/utils/strings"
)

type ProjectInvitationRepository struct {
	conn *sql.DB
}

const INVITATION_TOKEN_LENGTH = 80

func NewProjectInvitationRepository(conn *sql.DB) *ProjectInvitationRepository {

	return &ProjectInvitationRepository{
		conn: conn,
	}

}

type InvitationToken string

func randomIntBetween(min int, max int) int {
	return rand.Intn(max-min) + min
}
func generateToken() InvitationToken {
	tokenLength := randomIntBetween(10, INVITATION_TOKEN_LENGTH)
	token := InvitationToken(strings_utils.RandomString(tokenLength))
	return token
}
func (repo *ProjectInvitationRepository) CreateProjectInvitation(input ProjectInvitationInput) (InvitationToken, error) {
	psql := database.GetPsqlQueryBuilder()
	token := generateToken()
	query := psql.Insert("project_invitation").Columns("project_id", "token", "guest_email").Values(input.projectID, token, input.guestEmail)

	res, err := query.RunWith(repo.conn).Exec()

	if err != nil {
		return "", err
	}

	rowsAffected, err := res.RowsAffected()

	if err != nil {
		return "", err
	}

	if rowsAffected == 0 {
		return "", fmt.Errorf("error no rows affected")
	}

	return token, err

}

func (repo *ProjectInvitationRepository) CheckInvitationIsValid(invitationCheck ProjectInvitationCheck) (string, ProjectInvitationError) {
	psql := database.GetPsqlQueryBuilder()
	query := psql.Select("id", "token", "used", "guest_email", "expiration_date < now() as expired").
		From("project_invitation").
		Limit(1).
		Where(sq.Eq{"token": invitationCheck.token})

	rows, _ := query.RunWith(repo.conn).Query()

	defer rows.Close()

	var invitation ProjectInvitation
	if rows.Next() {
		rows.Scan(&invitation.id, &invitation.token, &invitation.used, &invitation.guestEmail, &invitation.expired)
	} else {
		return "", InvitationTokenNotFound
	}

	if invitation.guestEmail != invitationCheck.guestEmail {
		return "", InvitationEmailMismatch
	}

	if invitation.used {
		return "", InvitationAlreadyUsed
	}

	if invitation.expired {
		return "", InvitationExpired
	}

	return invitation.id, InvitationValid

}

func (repo *ProjectInvitationRepository) MarkInvitationAsUsed(invitationId string) error {
	psql := database.GetPsqlQueryBuilder()
	query := psql.Update("project_invitation").Set("used", true).Where(sq.Eq{"id": invitationId})
	_, err := query.RunWith(repo.conn).Exec()

	return err

}
