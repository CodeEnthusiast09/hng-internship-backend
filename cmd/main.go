package main

import (
	"log"
	"os"

	"github.com/CodeEnthusiast09/hng-stage-0-go/internal/handlers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load(".env")

	port := os.Getenv("PORT")

	ginMode := os.Getenv("GIN_MODE")

	gin.SetMode(ginMode)

	r := gin.Default()

	r.SetTrustedProxies(nil)

	r.GET("/me", handlers.GetProfile)

	log.Println("Server has started on Port:", port)

	r.Run(":" + port)
}
