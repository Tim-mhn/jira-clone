package project

import (
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/modules/auth"
)

type ProjectRouterGroups struct {
	ProjectsRoutes      *gin.RouterGroup
	SingleProjectRoutes *gin.RouterGroup
}

func GetProjectRouterGroups(router *gin.Engine, conn *sql.DB) ProjectRouterGroups {
	userRepo := auth.NewUserRepository(conn)
	projectRepo := NewProjectCommandsRepository(userRepo, conn)
	requiresAuthRoutes := router.Group("", auth.IsAuthenticatedMiddleware())

	projectsRoutes := requiresAuthRoutes.Group("/projects")

	singleProjectRoutes := projectsRoutes.Group(
		fmt.Sprintf(`/:%s`, PROJECT_ID_ROUTE_PARAM),
		CanAccessProjectMiddleware(projectRepo))

	return ProjectRouterGroups{
		ProjectsRoutes:      projectsRoutes,
		SingleProjectRoutes: singleProjectRoutes,
	}
}
func RegisterProjectsEndpoints(router *gin.Engine, conn *sql.DB) ProjectRouterGroups {
	userRepo := auth.NewUserRepository(conn)
	projectRepo := NewProjectCommandsRepository(userRepo, conn)
	projectQueriesRepo := NewProjectQueriesRepository(conn)

	pc := NewProjectController(projectRepo, projectQueriesRepo)

	projectRouteGroups := GetProjectRouterGroups(router, conn)
	singleProjectRoutes := projectRouteGroups.SingleProjectRoutes
	projectsRoutes := projectRouteGroups.ProjectsRoutes

	projectsRoutes.GET("", pc.GetUserProjects)

	projectsRoutes.POST("", pc.CreateProject)
	singleProjectRoutes.GET("", pc.GetProject)
	singleProjectRoutes.GET("/members", pc.GetProjectMembers)

	return projectRouteGroups

}
