package board

import tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"

type IBoardSprintsService interface {
	GetBoardSprints(projectID string, taskFilters tasks_models.TaskFilters) (BoardSprints, error)
}
