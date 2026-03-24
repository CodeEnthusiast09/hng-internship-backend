package services

import (
	"encoding/json"
	"io"
	"net/http"
	"time"
)

func FetchCatFact(factURL string) (*CatFact, error) {
	httpClient := http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := httpClient.Get(factURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var catFact CatFact
	if err = json.Unmarshal(data, &catFact); err != nil {
		return nil, err
	}

	return &catFact, nil
}

type CatFact struct {
	Fact   string `json:"fact"`
	Length int    `json:"length"`
}
