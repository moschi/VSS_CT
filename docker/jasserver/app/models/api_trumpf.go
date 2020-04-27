package jassmodels

import (
	"encoding/json"
	"net/http"
)

// GetTrumpfs
func GetTrumpfs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	var trumpfs []Trumpf

	database.Select(&trumpfs, "SELECT * FROM trumpf")

	json.NewEncoder(w).Encode(trumpfs)

	w.WriteHeader(http.StatusOK)
}
