package jassmodels

/*FullGame ...*/
type FullGame struct {
	ID         int64   `json:"id,omitempty"`
	IsFinished bool    `json:"isFinished,omitempty"`
	Teams      []Team  `json:"teams,omitempty"`
	Rounds     []Round `json:"rounds"`
}
