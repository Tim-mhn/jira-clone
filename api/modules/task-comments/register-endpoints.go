package task_comments

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/tasks"
	tasks_queries "github.com/tim-mhn/figma-clone/modules/tasks/queries"
)

func RegisterEndpoints(singleTaskRoutes tasks.SingleTaskRoutes, conn *sql.DB) {

	repo := newSQLTaskCommentsRepository(conn)

	projectQueries := project.NewProjectQueriesRepository(conn)
	tasksQueriesRepo := tasks_queries.NewTaskQueriesRepository(conn)
	tasksQueriesService := tasks_queries.NewTasksQueriesService(tasksQueriesRepo)

	controller := newTaskCommentsController(repo, projectQueries, tasksQueriesService)

	commentsRoutes := singleTaskRoutes.Group("/comments")

	commentsRoutes.POST("", controller.postComment)
	commentsRoutes.GET("", controller.getTaskComments)
	singleCommentRoutes := commentsRoutes.Group("/:commentID")
	singleCommentRoutes.PATCH("", controller.updateComment)
	singleCommentRoutes.DELETE("", controller.deleteComment)

}
