package project

type SendInvitationsDTO struct {
	GuestEmails []string `json:"guestEmails"`
}

type AcceptInvitationInputDTO struct {
	GuestEmail string `json:"guestEmail"`
	Token      string `json:"token"`
}
type AcceptInvitationOutputDTO AcceptInvitationOutput
