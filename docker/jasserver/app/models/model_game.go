package jassmodels

// Game ...
type Game struct {
	ID         int64  `json:"id,omitempty"`
	IsFinished bool   `json:"isFinished,omitempty"`
	Teams      []Team `json:"teams,omitempty"`
}
