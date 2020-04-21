package jassmodels

// PointsPerTeamPerRound ...
type PointsPerTeamPerRound struct {
	WiisPoints int64  `json:"wiisPoints,omitempty"`
	Points     int64  `json:"points,omitempty"`
	TeamID     int64  `json:"teamId,omitempty"`
	Round      *Round `json:"round,omitempty"`
}
