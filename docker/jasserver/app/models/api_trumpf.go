package jassmodels

import (
	"encoding/json"
	"net/http"
)

// GetTrumpfs
func GetTrumpfs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	var trumpfs []Trumpf

	databaseErr := database.Select(&trumpfs, "SELECT * FROM trumpf")
	if HandleDbError(w, databaseErr) {
		return
	}

	json.NewEncoder(w).Encode(trumpfs)

	w.WriteHeader(http.StatusOK)
}
