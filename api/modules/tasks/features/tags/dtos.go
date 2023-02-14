package tags

type _CreateTagDTO struct {
	Tag string `json:"tag" binding:"required"`
}
