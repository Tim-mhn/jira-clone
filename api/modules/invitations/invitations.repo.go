package invitations

import (
	"database/sql"
	"log"

	sq "github.com/Masterminds/squirrel"
	"github.com/tim-mhn/figma-clone/database"
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

func (repo *ProjectInvitationRepository) CreateProjectInvitations(input ProjectInvitationsInput) (InvitationTokens, error) {
	psql := database.GetPsqlQueryBuilder()
	query := psql.
		Insert("project_invitation").
		Columns("project_id", "guest_email")

	for _, email := range input.guestEmails {
		query = query.Values(input.projectID, email)
	}

	query = query.Suffix("RETURNING token")

	log.Println(query.ToSql())
	var tokens InvitationTokens
	res, err := query.RunWith(repo.conn).Query()

	if err != nil {
		return InvitationTokens{}, err
	}

	defer res.Close()

	for res.Next() {
		var token InvitationToken
		res.Scan(&token)
		tokens = append(tokens, token)
	}

	return tokens, err

}

func (repo *ProjectInvitationRepository) CheckInvitationIsValid(invitationTicket InvitationTicket) (ProjectInvitation, InvitationError) {
	psql := database.GetPsqlQueryBuilder()
	query := psql.Select("id", "project_id", "token", "used", "guest_email", "expiration_date < now() as expired").
		From("project_invitation").
		Limit(1).
		Where(sq.Eq{"token": invitationTicket.Token})

	rows, err := query.RunWith(repo.conn).Query()

	if err != nil {
		return ProjectInvitation{}, InvitationError{
			Source: err,
			Code:   OtherInvitationError,
		}
	}
	defer rows.Close()

	var invitation ProjectInvitation
	if rows.Next() {
		rows.Scan(&invitation.ID, &invitation.ProjectID, &invitation.Token, &invitation.Used, &invitation.GuestEmail, &invitation.Expired)
	} else {
		return ProjectInvitation{}, InvitationError{
			Code:   InvitationTokenNotFound,
			Source: nil,
		}
	}

	if invitation.GuestEmail != invitationTicket.Email {
		return ProjectInvitation{}, InvitationError{
			Code:   InvitationEmailMismatch,
			Source: nil,
		}
	}

	if invitation.Used {
		return ProjectInvitation{}, InvitationError{
			Code:   InvitationAlreadyUsed,
			Source: nil,
		}
	}

	if invitation.Expired {
		return ProjectInvitation{}, InvitationError{
			Code:   InvitationExpired,
			Source: nil,
		}
	}

	return invitation, InvitationError{
		NoError: true,
	}

}

func (repo *ProjectInvitationRepository) MarkInvitationAsUsed(invitationId string) error {
	psql := database.GetPsqlQueryBuilder()
	query := psql.Update("project_invitation").Set("used", true).Where(sq.Eq{"id": invitationId})
	_, err := query.RunWith(repo.conn).Exec()

	return err

}
