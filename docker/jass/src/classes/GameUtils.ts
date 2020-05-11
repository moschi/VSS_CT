import {FullGame, Trumpf, Team, Round} from './Game';

const trump: Trumpf[] = [
    { id: 1, name: 'Eichel', multiplier: 1 },
    { id: 2, name: 'Rose', multiplier: 1 },
    { id: 3, name: 'Schellen', multiplier: 2 },
    { id: 4, name: 'Schilten', multiplier: 2 },
    { id: 5, name: 'ObenAben', multiplier: 3 },
    { id: 6, name: 'UntenUfen', multiplier: 3 },
];

function calculatePointsPerTeam(game: FullGame) {
    const team1: Team = game.teams[0];
    const team2: Team = game.teams[1];

    let pointsTeam1: number = 0;
    let pointsTeam2: number = 0;

    if (game.rounds) {
        game.rounds.forEach((round: Round) => {
            for (let i = 0; i < 2; i++) {
                const teamToAddPoints = round.pointsPerTeamPerRound[i].teamId;
                const multiplier = trump[round.trumpfId-1].multiplier;
                if (team1.id === teamToAddPoints) {
                    pointsTeam1 += round.pointsPerTeamPerRound[i].points * multiplier;
                    pointsTeam1 += round.pointsPerTeamPerRound[i].wiisPoints * multiplier;
                } else if (team2.id === teamToAddPoints) {
                    pointsTeam2 += round.pointsPerTeamPerRound[i].points * multiplier;
                    pointsTeam2 += round.pointsPerTeamPerRound[i].wiisPoints * multiplier;
                } else {
                    console.log('Team does not exist: ' + teamToAddPoints);
                }
            }
        });
        return {
            team1: {
                team: team1,
                points: pointsTeam1,
            },
            team2: {
                team: team2,
                points: pointsTeam2,
            },
        };
    }
    return {
        team1: {
            team: team1,
            points: 0,
        },
        team2: {
            team: team2,
            points: 0,
        },
    };
}

export default calculatePointsPerTeam;
