package handlers

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/CodeEnthusiast09/hng-stage-0-go/internal/services"
	"github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
	name := os.Getenv("USER_NAME")

	email := os.Getenv("USER_EMAIL")

	stack := os.Getenv("USER_STACK")

	factURL := os.Getenv("CAT_FACT_API_URL")

	fact, err := services.FetchCatFact(factURL)
	if err != nil {
		log.Printf("Failed to fetch cat fact: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cat fact"})
		return
	}

	c.JSON(http.StatusOK, Profile{
		Status: "success",
		User: User{
			Name:  name,
			Email: email,
			Stack: stack,
		},
		Timestamp: time.Now().UTC(),
		Fact:      fact.Fact,
	})
}

type Profile struct {
	Status    string    `json:"status"`
	User      User      `json:"user"`
	Timestamp time.Time `json:"timestamp"`
	Fact      string    `json:"fact"`
}

type User struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Stack string `json:"stack"`
}
