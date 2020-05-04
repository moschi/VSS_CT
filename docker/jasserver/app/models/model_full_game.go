package jassmodels

/*FullGame ...*/
type FullGame struct {
	ID         int64   `json:"id"`
	IsFinished bool    `json:"isFinished"`
	Teams      []Team  `json:"teams"`
	Rounds     []Round `json:"rounds"`
}
