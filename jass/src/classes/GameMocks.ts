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
              name: "team1"
            }
          }, {
            points: 57,
            wiisPoints: 0,
            team: {
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
                        name: "team1"
                    }
                }, {
                    points: 57,
                    wiisPoints: 20,
                    team: {
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
                        name: "team1"
                    }
                }, {
                    points: 57,
                    wiisPoints: 0,
                    team: {
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
              name: "team1"
            }
          }, {
            points: 0,
            wiisPoints: 100,
            team: {
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
    __typename: "Game",
    id: "game2",
    rounds: [
      {
        __typename: "Round",
        pointsPerTeamPerRound: [
          {
            __typename: "PointsPerTeamPerRound",
            points: 100,
            wiisPoints: 100,
            team: {
              __typename: "Team",
              name: "someteamname"
            }
          }, {
            __typename: "PointsPerTeamPerRound",
            points: 57,
            wiisPoints: 0,
            team: {
              __typename: "Team",
              name: "someotherteamname"
            }
          }
        ],
        trump: {
          __typename: "Trump",
          multiplier: 3,
          name: "Trumpf"
        }
      },
      {
        __typename: "Round",
        pointsPerTeamPerRound: [
          {
            __typename: "PointsPerTeamPerRound",
            points: 257,
            wiisPoints: 0,
            team: {
              __typename: "Team",
              name: "someteamname"
            }
          }, {
            __typename: "PointsPerTeamPerRound",
            points: 0,
            wiisPoints: 100,
            team: {
              __typename: "Team",
              name: "someotherteamname"
            }
          }
        ],
        trump: {
          __typename: "Trump",
          multiplier: 2,
          name: "Anderer Trumpf"
        }
      }
    ]
  }
];

export default GameMocks;
