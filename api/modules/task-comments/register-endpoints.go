package task_comments

import (
	"database/sql"

	"github.com/tim-mhn/figma-clone/modules/tasks"
)

func RegisterEndpoints(singleTaskRoutes tasks.SingleTaskRoutes, conn *sql.DB) {

	repo := newSQLTaskCommentsRepository(conn)
	controller := newTaskCommentsController(repo)

	commentsRoutes := singleTaskRoutes.Group("/comments")

	commentsRoutes.POST("", controller.postComment)
	commentsRoutes.GET("", controller.getTaskComments)
}
