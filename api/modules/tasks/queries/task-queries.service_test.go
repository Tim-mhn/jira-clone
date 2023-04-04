package tasks_queries

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/tim-mhn/figma-clone/modules/auth"
	task_type "github.com/tim-mhn/figma-clone/modules/task-type"
	tasks_errors "github.com/tim-mhn/figma-clone/modules/tasks/errors"
	"github.com/tim-mhn/figma-clone/modules/tasks/features/tags"
	tasks_models "github.com/tim-mhn/figma-clone/modules/tasks/models"
	tests_utils "github.com/tim-mhn/figma-clone/utils/tests"
)

func TestTaskQueriesServiceGetTaskByID(t *testing.T) {

	mockRepo := new(MockTaskQueriesRepo)
	service := NewTasksQueriesService(mockRepo)

	taskID := "task-id-123"
	rawTitle := tags.BuildTitleWithTags(tags.TaskTitleParts{{
		Text:  "Hello",
		IsTag: false,
	}, {
		Text:  "dev",
		IsTag: true,
	}, {
		Text:  "world",
		IsTag: false,
	}})

	taskPersistence := TaskPersistenceModel{
		id:          taskID,
		rawTitle:    rawTitle,
		project_key: "WP",
		task_number: 12,
		description: "a description",
		Type: task_type.TaskType{
			Id:    1,
			Label: "Bug",
			Color: "Destructive",
			Icon:  "cross",
		},
		assignee_id:    "assignee-id-xyz-123",
		assignee_name:  "Uncle Bob",
		assignee_email: "uncle.bob@mail.com",
		sprint_id:      "sprint-123-id",
		sprint_name:    "sprint 123",
	}
	t.Run("it should correctly build the task key", func(t *testing.T) {

		mockRepo.On("GetTaskByID", taskID).Return(taskPersistence, nil)

		task, _ := service.GetTaskByID(taskID)

		expectedTaskKey := "WP-12"

		assert.Equal(t, expectedTaskKey, *task.Key)
	})

	t.Run("it should correctly map the id, rawTitle, type and description fields from the Persistence Model", func(t *testing.T) {

		mockRepo.On("GetTaskByID", taskID).Return(taskPersistence, nil)

		task, _ := service.GetTaskByID(taskID)

		assert.Equal(t, taskPersistence.rawTitle, *task.RawTitle)
		assert.Equal(t, taskPersistence.description, *task.Description)
		assert.Equal(t, taskPersistence.id, *task.Id)
		assert.Equal(t, taskPersistence.Type, task.Type)

	})

	t.Run("it should correctly map the sprint id and name", func(t *testing.T) {

		mockRepo.On("GetTaskByID", taskID).Return(taskPersistence, nil)

		task, _ := service.GetTaskByID(taskID)

		assert.Equal(t, "sprint-123-id", task.Sprint.Id)
		assert.Equal(t, "sprint 123", task.Sprint.Name)

	})

	t.Run("it should correctly build the task assignee", func(t *testing.T) {

		mockRepo.On("GetTaskByID", taskID).Return(taskPersistence, nil)

		task, _ := service.GetTaskByID(taskID)

		assigneeID := "assignee-id-xyz-123"
		assigneeName := "Uncle Bob"
		assigneeEmail := "uncle.bob@mail.com"

		assert.Equal(t, assigneeID, task.Assignee.Id)
		assert.Equal(t, assigneeName, task.Assignee.Name)
		assert.Equal(t, assigneeEmail, task.Assignee.Email)
		assert.NotEqual(t, "", task.Assignee.Icon)

	})

	t.Run("it should correctly build the Title by removing tags from the rawTitle", func(t *testing.T) {

		mockRepo.On("GetTaskByID", taskID).Return(taskPersistence, nil)

		task, _ := service.GetTaskByID(taskID)

		expectedTitle := "Hello  world"

		assert.Equal(t, expectedTitle, *task.Title)

	})

	t.Run("it should correctly set the Tags field ", func(t *testing.T) {

		mockRepo.On("GetTaskByID", taskID).Return(taskPersistence, nil)

		task, _ := service.GetTaskByID(taskID)

		expectedTags := []string{"dev"}
		assert.Equal(t, expectedTags, task.Tags)

	})

}

func TestTaskQueriesServiceGetTSprintTasks(t *testing.T) {

	rawTitle := tags.BuildTitleWithTags(tags.TaskTitleParts{{
		Text:  "Hello",
		IsTag: false,
	}, {
		Text:  "dev",
		IsTag: true,
	}, {
		Text:  "world",
		IsTag: false,
	}})

	taskID := "task-id-890"

	taskPersistence := TaskPersistenceModel{
		id:          taskID,
		rawTitle:    rawTitle,
		project_key: "WP",
		task_number: 12,
		description: "a description",
		Type: task_type.TaskType{
			Id:    1,
			Label: "Bug",
			Color: "Destructive",
			Icon:  "cross",
		},
		points:         4,
		assignee_id:    "assignee-id-xyz-123",
		assignee_name:  "Uncle Bob",
		assignee_email: "uncle.bob@mail.com",
	}

	tasks := []TaskPersistenceModel{taskPersistence}

	t.Run("it should correctly map the repo results to Task objects", func(t *testing.T) {
		mockRepo := new(MockTaskQueriesRepo)
		service := NewTasksQueriesService(mockRepo)

		mockRepo.On("GetSprintTasks", mock.Anything, mock.Anything).Return(tasks, nil)

		tasks, _ := service.GetSprintTasks("sprint-id", tasks_models.TaskFilters{})

		task1 := tasks[0]

		expectedTitle := "Hello  world"
		expectedPoints := 4
		expectedAssignee := auth.BuildUserWithIcon(taskPersistence.assignee_id, taskPersistence.assignee_name, taskPersistence.assignee_email)

		assert.EqualValues(t, expectedTitle, *task1.Title)
		assert.EqualValues(t, rawTitle, *task1.RawTitle)
		assert.EqualValues(t, expectedPoints, task1.Points)
		assert.EqualValues(t, expectedAssignee, task1.Assignee)

	})

	t.Run("it should return an error if the repo returns one", func(t *testing.T) {
		mockRepo := new(MockTaskQueriesRepo)
		service := NewTasksQueriesService(mockRepo)

		mockRepo.On("GetSprintTasks", mock.Anything, mock.Anything).Return(tasks, fmt.Errorf("error in GetSprintTasks"))

		_, err := service.GetSprintTasks("sprint-id", tasks_models.TaskFilters{})

		assert.NotNil(t, err)

	})
}

type MockTaskQueriesRepo struct {
	mock.Mock
}

func (repo *MockTaskQueriesRepo) GetTaskByID(taskID string) (TaskPersistenceModel, tasks_errors.TaskError) {
	args := repo.Called(taskID)

	return args.Get(0).(TaskPersistenceModel), tasks_errors.NoTaskError()
}

func (repo *MockTaskQueriesRepo) GetSprintTasks(sprintID string, filters tasks_models.TaskFilters) ([]TaskPersistenceModel, error) {
	args := repo.Called(sprintID, filters)

	err := tests_utils.CastToErrorIfNotNil(args.Get(1))
	return args.Get(0).([]TaskPersistenceModel), err
}
