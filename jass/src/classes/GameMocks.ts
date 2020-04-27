import {Game} from "./Game";

const GameMocks: Game[] = [
    {
        id: "asdfjewr",
        rounds: [
            {
                pointsPerTeamPerRound: [
                    {
                        points: 190,
                        wiisPoints: 30,
                        team: {
                            id: 0,
                            name: "team1"
                        }
                    }, {
                        points: 57,
                        wiisPoints: 0,
                        team: {
                            id: 1,
                            name: "team2"
                        }
                    }
                ],
                trump: {
                    multiplier: 3,
                    name: "Trumpf"
                }
            },
            {
                pointsPerTeamPerRound: [
                    {
                        points: 221,
                        wiisPoints: 250,
                        team: {
                            id: 0,
                            name: "team1"
                        }
                    }, {
                        points: 57,
                        wiisPoints: 20,
                        team: {
                            id: 1,
                            name: "team2"
                        }
                    }
                ],
                trump: {
                    multiplier: 3,
                    name: "Trumpf"
                }
            },
            {
                pointsPerTeamPerRound: [
                    {
                        points: 520,
                        wiisPoints: 45,
                        team: {
                            id: 0,
                            name: "team1"
                        }
                    }, {
                        points: 57,
                        wiisPoints: 0,
                        team: {
                            id: 1,
                            name: "team2"
                        }
                    }
                ],
                trump: {
                    multiplier: 3,
                    name: "Trumpf"
                }
            },
            {
                pointsPerTeamPerRound: [
                    {
                        points: 290,
                        wiisPoints: 40,
                        team: {
                            id: 0,
                            name: "team1"
                        }
                    }, {
                        points: 0,
                        wiisPoints: 100,
                        team: {
                            id: 1,
                            name: "team2"
                        }
                    }
                ],
                trump: {
                    multiplier: 2,
                    name: "Anderer Trumpf"
                }
            }
        ]
    },
    {
        id: "56",
        rounds: [{
            pointsPerTeamPerRound: [
                {
                    points: 0,
                    wiisPoints: 0,
                    team: {
                        id: 0,
                        name: "someteamname"
                    }
                }, {
                    points: 0,
                    wiisPoints: 0,
                    team: {
                        id: 1,
                        name: "someotherteamname"
                    }
                }
            ],
            trump: {
                multiplier: 3,
                name: "Trumpf"
            }
        },]
    },
    {
        id: "game2",
        rounds: [
            {
                pointsPerTeamPerRound: [
                    {
                        points: 100,
                        wiisPoints: 100,
                        team: {
                            id: 0,
                            name: "someteamname"
                        }
                    }, {
                        points: 57,
                        wiisPoints: 0,
                        team: {
                            id: 1,
                            name: "someotherteamname"
                        }
                    }
                ],
                trump: {
                    multiplier: 3,
                    name: "Trumpf"
                }
            },
            {
                pointsPerTeamPerRound: [
                    {
                        points: 257,
                        wiisPoints: 0,
                        team: {
                            id: 3,
                            name: "someteamname"
                        }
                    }, {
                        points: 0,
                        wiisPoints: 100,
                        team: {
                            id: 5,
                            name: "someotherteamname"
                        }
                    }
                ],
                trump: {
                    multiplier: 2,
                    name: "Anderer Trumpf"
                }
            }
        ]
    }
];

export default GameMocks;
