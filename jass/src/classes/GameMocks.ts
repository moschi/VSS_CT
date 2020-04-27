import {FullGame} from "./Game";

const GameMocks: FullGame[] = [
    {
        id: 0,
        isFinished: false,
        teams: [{id:0, name:"spastikers"}, {id:1, name:"oberspastikers"}],
        rounds: [
            {
                id:0,
                pointsPerTeamPerRound: [
                    {
                        points: 190,
                        wiisPoints: 30,
                        teamId: 0
                    }, {
                        points: 57,
                        wiisPoints: 0,
                        teamId: 1
                    }
                ],
                trumpfId:1
            },
            {
                id:0,
                pointsPerTeamPerRound: [
                    {
                        points: 190,
                        wiisPoints: 30,
                        teamId: 0
                    }, {
                        points: 57,
                        wiisPoints: 0,
                        teamId: 1
                    }
                ],
                trumpfId:1
            },
            {
                id:0,
                pointsPerTeamPerRound: [
                    {
                        points: 190,
                        wiisPoints: 30,
                        teamId: 0
                    }, {
                        points: 57,
                        wiisPoints: 0,
                        teamId: 1
                    }
                ],
                trumpfId:1
            },
            {
                id:0,
                pointsPerTeamPerRound: [
                    {
                        points: 190,
                        wiisPoints: 30,
                        teamId: 0
                    }, {
                        points: 57,
                        wiisPoints: 0,
                        teamId: 1
                    }
                ],
                trumpfId:1
            },
        ]
    }
];

export default GameMocks;
