import {Game} from "./Game";

const GameMocks: Game[] = [
    {
        id: "asdfjewr",
        rounds: [{
            pointsPerTeamPerRound: [
                {
                    points: 100,
                    wiisPoints: 100,
                    team: {name: "team1"}
                }, {
                    points: 57,
                    wiisPoints: 0,
                    team: {name: "team2"}
                }],
            trump: {multiplier: 3, name: "Trumpf"}
        },
            {
                pointsPerTeamPerRound: [
                    {
                        points: 257,
                        wiisPoints: 0,
                        team: {name: "team1"}
                    }, {
                        points: 0,
                        wiisPoints: 100,
                        team: {name: "team2"}
                    }],
                trump: {multiplier: 2, name: "Anderer Trumpf"}
            }
        ]
    },
    {
        id: "game2",
        rounds: [{
            pointsPerTeamPerRound: [
                {
                    points: 100,
                    wiisPoints: 100,
                    team: {name: "someteamname"}
                }, {
                    points: 57,
                    wiisPoints: 0,
                    team: {name: "someotherteamname"}
                }],
            trump: {multiplier: 3, name: "Trumpf"}
        },
            {
                pointsPerTeamPerRound: [
                    {
                        points: 257,
                        wiisPoints: 0,
                        team: {name: "someteamname"}
                    }, {
                        points: 0,
                        wiisPoints: 100,
                        team: {name: "someotherteamname"}
                    }],
                trump: {multiplier: 2, name: "Anderer Trumpf"}
            }
        ]
    }
];

export default GameMocks;
