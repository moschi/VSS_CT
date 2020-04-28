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
                trumpfId:5
            },
            {
                id:1,
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
                id:2,
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
                id:3,
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
                trumpfId:3
            },
        ]
    }, {
        id: 1,
        isFinished: false,
        teams: [{id:0, name:"blah"}, {id:1, name:"blahblahe"}],
        rounds: []

    },
    {
        id: 2,
        isFinished: false,
        teams: [{id:0, name:"Oberbabos"}, {id:1, name:"Überbabos"}],
        rounds: []

    }
];

export default GameMocks;
