package project

type NewProjectDTO struct {
	Name string `json:"name"`
	Key  string `json:"key"`
}

type AddMemberToProjectDTO struct {
	MemberID string `json:"memberID"`
}
