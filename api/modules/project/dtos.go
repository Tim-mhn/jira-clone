package project

type ProjectInvitationDTO struct {
	GuestEmail string `json:"guestEmail"`
}

type AcceptInvitationInputDTO struct {
	GuestEmail string `json:"guestEmail"`
	Token      string `json:"token"`
}
type AcceptInvitationOutputDTO AcceptInvitationOutput
