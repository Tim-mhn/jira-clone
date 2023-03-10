package task_comments

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/project"
	"github.com/tim-mhn/figma-clone/modules/tasks"
)

func RegisterEndpoints(singleTaskRoutes tasks.SingleTaskRoutes, conn *sql.DB) {

	repo := newSQLTaskCommentsRepository(conn)

	projectQueries := project.NewProjectQueriesRepository(conn)
	controller := newTaskCommentsController(repo, projectQueries)

	commentsRoutes := singleTaskRoutes.Group("/comments")

	commentsRoutes.POST("", controller.postComment)
	commentsRoutes.GET("", controller.getTaskComments)
	singleCommentRoutes := commentsRoutes.Group("/:commentID")
	singleCommentRoutes.PATCH("", controller.updateComment)
	singleCommentRoutes.DELETE("", controller.deleteComment)

}
