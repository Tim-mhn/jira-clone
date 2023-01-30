package project

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type ProjectsRoutes = *gin.RouterGroup
type SingleProjectRoutes = *gin.RouterGroup
type ProjectRouterGroups struct {
	ProjectsRoutes      ProjectsRoutes
	SingleProjectRoutes SingleProjectRoutes
}

func GetProjectRouterGroups(router *gin.Engine, conn *sql.DB) ProjectRouterGroups {
	projectQueries := NewProjectQueriesRepository(conn)

	requiresAuthRoutes := router.Group("", auth.IsAuthenticatedMiddleware())

	projectsRoutes := requiresAuthRoutes.Group("/projects")

	singleProjectRoutes := projectsRoutes.Group(
		fmt.Sprintf(`/:%s`, PROJECT_ID_ROUTE_PARAM),
		CanAccessProjectMiddleware(projectQueries))

	return ProjectRouterGroups{
		ProjectsRoutes:      projectsRoutes,
		SingleProjectRoutes: singleProjectRoutes,
	}
}
func RegisterEndpoints(router *gin.Engine, conn *sql.DB) ProjectRouterGroups {
	userRepo := auth.NewUserRepository(conn)
	projectQueries := NewProjectQueriesRepository(conn)
	projectRepo := NewProjectCommandsRepository(userRepo, conn)

	pc := NewProjectController(projectRepo, projectQueries)

	projectRouteGroups := GetProjectRouterGroups(router, conn)
	singleProjectRoutes := projectRouteGroups.SingleProjectRoutes
	projectsRoutes := projectRouteGroups.ProjectsRoutes

	projectsRoutes.GET("", pc.GetUserProjects)

	projectsRoutes.POST("", pc.CreateProject)
	singleProjectRoutes.GET("", pc.GetProject)
	singleProjectRoutes.DELETE("", pc.DeleteProject)

	singleProjectRoutes.GET("/members", pc.GetProjectMembers)

	return projectRouteGroups

}
