import {Game, Round} from "./Game";
import {RefObject} from "react";
import calculatePointsPerTeam from "../classes/GameUtils";

class DrawGameBoard {

    canvas: RefObject<HTMLCanvasElement>;
    game: Game;
    jasstafel: string;

    constructor(canvas: RefObject<HTMLCanvasElement>, game: Game, jasstafel: string) {
        this.canvas = canvas;
        this.game = game;
        this.jasstafel = jasstafel;
    }

    loadImage(): Promise<HTMLImageElement> {
        return new Promise((resolve) => {
            let backgroundImage = new Image(515, 720);
            backgroundImage.src = this.jasstafel;
            resolve(backgroundImage);
        })
    }

    renderDefaultBoard() {

        this.loadImage()
            .then((backgroundImage) => {
                if (this.canvas.current) {
                    let context = this.canvas.current.getContext("2d");
                    if (backgroundImage) {
                        backgroundImage.onload = function () {
                            if (context) {
                                context.drawImage(backgroundImage, 0, 0);
                            }
                        }
                    }
                }
            })
    }

    drawPoints(pointsTeam1:number, pointsTeam2:number, rest:{team1:number, team2:number}):{team1:number, team2:number}{

        return {team1: 1, team2:1}
    }

    render() {
        this.renderDefaultBoard();

        const rounds =this.game.rounds;

        let points = calculatePointsPerTeam(this.game);

        const team1 = points.team1.team.name;
        const team2 = points.team2.team.name;

        let pointsTeam1= points.team1.points;
        let pointsTeam2 = points.team2.points;

        let rest = {team1: 0, team2: 0};


        rounds.forEach((round:Round)=>{
            const pointPerRound = round.pointsPerTeamPerRound;
            let pointsPerRoundTeam1 = 0;
            let pointsPerRoundTeam2 = 0;

            for(let i = 0; i<2; i++){
                let team = pointPerRound[i].team.name;
                let points = pointPerRound[i].points;
                if(team === team1){
                    pointsPerRoundTeam1 = points;
                }else if(team === team2){
                    pointsPerRoundTeam2 = points;
                }
            }
            rest = this.drawPoints(pointsPerRoundTeam1, pointsPerRoundTeam2, rest);
            pointsTeam1 -= pointsPerRoundTeam1;
            pointsTeam2 -= pointsPerRoundTeam2;
        })





    }
}

export default DrawGameBoard;
