export interface FullGame {
    __typename?: string
    id: number
    isFinished: boolean
    teams: Team[]
    rounds: Round[]
}

export interface Game{
    id:number,
    isFinished:boolean
    teams: Team[]
}

export interface GameCreation {
    teams: Team[]
}

export interface Team {
    __typename?: string
    id: number
    name: string
}

export interface Trumpf {
    __typename?: string
    id:number
    name: string
    multiplier: number
}

export interface Round {
    __typename?: string
    id: number
    trumpfId: number
    pointsPerTeamPerRound: PointsPerTeamPerRound[],
}
export interface PointsPerTeamPerRound {
    __typename?: string
    wiisPoints: number
    points: number
    teamId: number
}
