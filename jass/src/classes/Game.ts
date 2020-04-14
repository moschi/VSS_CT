export interface Game {
  __typename?: string,
  id: string;
  rounds: Round[];
}

export interface Team {
  __typename?: string,
  id?: number
  name: string;
}

export interface Trump {
  __typename?: string,
  name: string;
  multiplier: number;
}


export interface Round {
  __typename?: string,
  trump: Trump;
  pointsPerTeamPerRound: PointsPerTeamPerRound[];

}

export interface PointsPerTeamPerRound {
  __typename?: string,
  wiisPoints: number;
  points: number;
  team: Team;
}
