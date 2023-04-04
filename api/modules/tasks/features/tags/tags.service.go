package tags

import "database/sql"

/**
* TODO:
- Align tag template between FE & BE (BE should return template to frontend) CHECK
- Store list of tags of project in DB & bind to endpoint

*/
type ITagsService interface {
	ExtractAndUpdateTagsOfTask(taskID string, htmlTitle string) error
	GetTaskTagTemplate() TaskTagTemplate
	CreateTagForProject(tag TaskTag, projectID string) error
	GetProjectTags(projectID string) ([]TaskTag, error)
}
type TagsService struct {
	repo TagsRepository
}

func NewTagsService(conn *sql.DB) ITagsService {
	repo := newTagsRepository(conn)
	return TagsService{repo: repo}
}

func (service TagsService) ExtractAndUpdateTagsOfTask(taskID string, htmlTitle string) error {

	/**
	* - tags := extractTags(title)
	* - repo.updateTaskTags(id, tags)
	 */
	tags := ExtractTagsFromHTMLTitle(htmlTitle)
	return service.repo.UpdateTaskTags(taskID, tags)

}

func (service TagsService) GetTaskTagTemplate() TaskTagTemplate {
	return TASK_TAG_TEMPLATE()

}

func (service TagsService) CreateTagForProject(tag TaskTag, projectID string) error {
	return service.repo.createTagForProject(tag, projectID)
}

func (service TagsService) GetProjectTags(projectID string) ([]TaskTag, error) {
	return service.repo.getProjectTags(projectID)
}
