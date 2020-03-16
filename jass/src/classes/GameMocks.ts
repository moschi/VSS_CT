import {Game} from "./Game";

const GameMocks: Game[] = [
  {
    __typename: "Game",
    id: "asdfjewr",
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
              name: "team1"
            }
          }, {
            __typename: "PointsPerTeamPerRound",
            points: 57,
            wiisPoints: 0,
            team: {
              __typename: "Team",
              name: "team2"
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
              name: "team1"
            }
          }, {
            __typename: "PointsPerTeamPerRound",
            points: 0,
            wiisPoints: 100,
            team: {
              __typename: "Team",
              name: "team2"
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
