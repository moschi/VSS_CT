export interface Game{
    id:string;
    rounds:Round[];
}

export interface Team{
    name:string;
}

export interface Trump{
    name:string;
    multiplier:number;
}


export interface Round{
    trump:Trump;
    pointsPerTeamPerRound:PointsPerTeamPerRound[];

}

export interface PointsPerTeamPerRound{
    wiisPoints:number;
    points:number;
    team:Team;
}
