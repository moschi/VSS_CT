import {FullGame, Game} from "./Game";
import {Team} from "./Game";
import {Round} from "./Game";

function calculatePointsPerTeam(game: FullGame) {

    const rounds: Round[] = game.rounds;

    const team1: Team = game.teams[0];
    const team2: Team = game.teams[1];

    let pointsTeam1: number = 0;
    let pointsTeam2: number = 0;

    rounds.forEach((round: Round) => {
        for (let i = 0; i < 2; i++) {
            const teamToAddPoints = round.pointsPerTeamPerRound[i].teamId;
            if (team1.id === teamToAddPoints) {
                pointsTeam1 += round.pointsPerTeamPerRound[i].points;
                pointsTeam1 += round.pointsPerTeamPerRound[i].wiisPoints;
            } else if (team2.id === teamToAddPoints) {
                pointsTeam2 += round.pointsPerTeamPerRound[i].points;
                pointsTeam2 += round.pointsPerTeamPerRound[i].wiisPoints;
            } else {
                console.log("Team does not exist: " + teamToAddPoints)
            }
        }
    });

    return {
        team1: {
            team: team1,
            points: pointsTeam1
        },
        team2: {
            team: team2,
            points: pointsTeam2
        }
    };


}

export default calculatePointsPerTeam;
