import {Game} from "./Game";
import {Team} from "./Game";
import {Round} from "./Game";

function calculatePointsPerTeam(game: Game) {

    const rounds: Round[] = game.rounds;

    const team1: Team = rounds[0].pointsPerTeamPerRound[0].team;
    const team2: Team = rounds[0].pointsPerTeamPerRound[1].team;

    let pointsTeam1: number = 0;
    let pointsTeam2: number = 0;

    rounds.forEach((round: Round) => {

        for (let i = 0; i < 2; i++) {

            const teamToAddPoints = round.pointsPerTeamPerRound[i].team.name;

            if (team1.name === teamToAddPoints) {
                pointsTeam1 += round.pointsPerTeamPerRound[i].points;
                pointsTeam1 += round.pointsPerTeamPerRound[i].wiisPoints;
            } else if (team2.name === teamToAddPoints) {
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
