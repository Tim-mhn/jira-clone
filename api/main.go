package main

import (
	"github.com/gin-gonic/gin"
	"github.com/tim-mhn/figma-clone/controllers"
)

func main() {
	router := gin.Default()
	controllers.RegisterControllers(router)
	router.Run("localhost:8080")
}
