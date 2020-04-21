package jassmodels

// Round ...
type Round struct {
	ID            int64                   `json:"id,omitempty"`
	TrumpfID      int64                   `json:"trumpfId,omitempty"`
	PointsPerTeam []PointsPerTeamPerRound `json:"pointsPerTeam,omitempty"`
}
