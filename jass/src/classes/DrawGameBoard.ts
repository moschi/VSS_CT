import {Game, Round} from "./Game";
import {Context, RefObject} from "react";
import calculatePointsPerTeam from "../classes/GameUtils";
import {PointsDrawn, Rest} from "./drawing";

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

    renderDefaultBoard(): Promise<CanvasRenderingContext2D> {
        return this.loadImage()
            .then((backgroundImage) => {
                return new Promise((resolve, reject) => {
                    if (this.canvas.current) {
                        let context = this.canvas.current.getContext("2d");
                        if (backgroundImage) {
                            backgroundImage.onload = function () {
                                if (context) {
                                    context.drawImage(backgroundImage, 0, 0);
                                    resolve(context);
                                }
                            }
                        }
                    }
                });
            })
    }


    drawPoints(pointsTeam1: number,
               pointsTeam2: number,
               rest: Rest,
               context: CanvasRenderingContext2D,
               pointsDrawn: PointsDrawn)
        : {
        team1: number,
        team2: number,
        pointsDrawn: PointsDrawn
    } {
        const strokeLength = 30;
        const strokeWidth = 3;
        const strokeMargin = 6;

        const marginLeft = 130;
        const marginLeftCrosses = 170;
        const marginCrossLegs = 5;

        const marginTop = 115;
        const marginMid = marginTop + 140;
        const marginBot = marginMid + 42;
        const marginTeams = 290;


        let draw = (callback: () => void) => {
            context.beginPath();
            context.lineWidth = strokeWidth;
            context.strokeStyle = "white";
            callback();
            context.stroke();
        };

        let drawFifthLine = (x: number, y: number) => {
            draw(() => {
                context.moveTo(x - strokeMargin, y + (strokeLength / 2));
                context.lineTo(x + (4 * strokeMargin), y - (strokeLength / 2));
            })
        };

        let drawLine = (x: number, y: number) => {
            draw(() => {
                context.moveTo(x, y - (strokeLength / 2));
                context.lineTo(x, y + (strokeLength / 2));
            });
        };

        let drawLineCross = (x: number, y: number, ltr: boolean) => {
            draw(() => {
                if (ltr) {
                    context.moveTo(x, y - (strokeLength / 2));
                    context.lineTo(marginCrossLegs + x, y + (strokeLength / 2));
                } else {
                    context.moveTo(x + marginCrossLegs, y - (strokeLength / 2));
                    context.lineTo(x, y + (strokeLength / 2));
                }
            })

        };
        pointsTeam1+= rest.team1;
        pointsTeam2+=rest.team2;

        let oneT = Math.floor(pointsTeam1 / 100);
        let oneM = Math.floor((pointsTeam1 % 100) / 50);
        let oneB = Math.floor(pointsTeam1 % 100 % 50 / 20);
        let restOne = pointsTeam1 - oneT*100 -oneM*50 -oneB*20;

        let twoT = Math.floor(pointsTeam2 / 100);
        let twoM = Math.floor((pointsTeam2 % 100) / 50);
        let twoB = Math.floor(pointsTeam2 % 100 % 50 / 20);
        let restTwo = pointsTeam2 - twoT*100 -twoM*50 -twoB*20;

        let strokeArray = [oneT, oneM, oneB, twoT, twoM, twoB];
        let marginTopArray = [marginTop, marginMid, marginBot, marginTop + marginTeams, marginMid + marginTeams, marginBot + marginTeams];
        let drawnArray = [pointsDrawn.oneT, pointsDrawn.oneM, pointsDrawn.oneB, pointsDrawn.twoT, pointsDrawn.twoM, pointsDrawn.twoB];

        for(let i = 0; i< 6; i++){
            let strokeCount = strokeArray[i];
            let margin = marginTopArray[i];
            let drawnCount = drawnArray[i];
            while (strokeCount > 0) {
                if (i !== 1 && i !== 4) {
                    let isFifth = (drawnCount + 1) % 5 === 0 && drawnCount !== 0;
                    if (isFifth) {
                        drawFifthLine(marginLeft + (strokeMargin * (drawnCount - 4)), margin);
                    } else {
                        drawLine(marginLeft + (strokeMargin * drawnCount), margin);
                    }
                } else {
                    let numOfCross = Math.floor(drawnCount / 2);
                    let ltr = drawnCount % 2 == 0;
                    drawLineCross(marginLeftCrosses + (numOfCross * (marginCrossLegs + (2 * strokeWidth + strokeMargin))),
                        margin - (numOfCross * (2 * strokeWidth + strokeMargin)),
                        ltr);
                }
                drawnCount++;
                drawnArray[i]++;
                strokeCount--;
            }
            pointsDrawn.oneT = drawnArray[0];
            pointsDrawn.oneM = drawnArray[1];
            pointsDrawn.oneB = drawnArray[2];
            pointsDrawn.twoT = drawnArray[3];
            pointsDrawn.twoM = drawnArray[4];
            pointsDrawn.twoB = drawnArray[5];
        }
        return {team1: Number(restOne), team2: Number(restTwo), pointsDrawn: pointsDrawn}
    }

    drawRest(rest: Rest,
             context: CanvasRenderingContext2D) {

        const restTeamOne:string = rest.team1.toString();
        const restTeamTwo:string = rest.team2.toString();

        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.font = "25px Arial";
        context.strokeText(restTeamOne, 375,200);
        context.strokeText(restTeamTwo, 375,500);


    }

    render() {
        this.renderDefaultBoard()
            .then(async (context) => {
                const rounds = this.game.rounds;

                let points = calculatePointsPerTeam(this.game);

                const team1 = points.team1.team.name;
                const team2 = points.team2.team.name;

                let pointsTeam1 = points.team1.points;
                let pointsTeam2 = points.team2.points;

                let rest = {team1: 0, team2: 0};
                let pointsDrawn = {oneT: 0, oneM: 0, oneB: 0, twoT: 0, twoM: 0, twoB: 0};

                await rounds.forEach((round: Round) => {
                    const pointPerRound = round.pointsPerTeamPerRound;
                    let pointsPerRoundTeam1 = 0;
                    let pointsPerRoundTeam2 = 0;

                    for (let i = 0; i < 2; i++) {
                        let team = pointPerRound[i].team.name;
                        let points = pointPerRound[i].points;
                        if (team === team1) {
                            pointsPerRoundTeam1 = points;
                        } else if (team === team2) {
                            pointsPerRoundTeam2 = points;
                        }
                    }
                    rest = this.drawPoints(pointsPerRoundTeam1, pointsPerRoundTeam2, rest, context, pointsDrawn);
                    pointsTeam1 -= pointsPerRoundTeam1;
                    pointsTeam2 -= pointsPerRoundTeam2;
                });
                this.drawRest(rest, context);
            });
    }
}

export default DrawGameBoard;
