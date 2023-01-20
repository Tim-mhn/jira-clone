package invitations

type SendInvitationsDTO struct {
	GuestEmails []string `json:"guestEmails"`
}

type AcceptInvitationDTO struct {
	Email string          `json:"email"`
	Token InvitationToken `json:"token"`
}
