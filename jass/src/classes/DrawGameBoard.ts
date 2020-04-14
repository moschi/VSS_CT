import {Game, Round} from "./Game";
import {Context, RefObject} from "react";
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

    renderDefaultBoard(): Promise<CanvasRenderingContext2D> {
        return this.loadImage()
            .then((backgroundImage) => {
                return new Promise((resolve, reject) =>{
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



    drawPoints(pointsTeam1:number,
               pointsTeam2:number,
               rest:{team1:number, team2:number},
               context:CanvasRenderingContext2D,
               pointsDrawn:{oneT:number, oneM:number, oneB:number, twoT:number, twoM:number, twoB:number})
        : {team1:number,
        team2:number,
        pointsDrawn:{oneT:number, oneM:number, oneB:number, twoT:number, twoM:number, twoB:number}}{

        //calc each margin for itself!
        const strokeLength = 50;
        const strokeWidth = 3;
        const crossLegMarginX = 15;
        const teamBoardMargin = 290;
        const strokeMargin = 7;

        let draw = (callback: ()=>void)=>{
            context.beginPath();
            context.lineWidth = strokeWidth;
            context.strokeStyle = "white";
            callback();
            context.stroke();
        };

        let drawFifthLine = (x:number, y:number)=>{
            draw(()=>{
                context.moveTo(x-strokeMargin, y+strokeLength);
                context.lineTo(x + (4*strokeMargin), y);
            })
        };

        let drawLine = (x:number, y:number)=>{
            draw(()=>{
                context.moveTo(x, y);
                context.lineTo(x, y+strokeLength);
            });
        };

        let drawLineCross = (x:number, y:number, ltr:boolean)=>{
            draw(()=>{
                if(ltr){
                    context.moveTo(x, y);
                    context.lineTo(crossLegMarginX + x, y+strokeLength);
                }else{
                    context.moveTo(x+crossLegMarginX, y);
                    context.lineTo(x, y+strokeLength);
                }
            })

        };

        let startingPointTopTeamOneX = 130;
        let startingPointTopTeamOneY = 90;

        let startingPointMidTeamOneX = 170;
        let startingPointMidTeamOneY = 225;

        let startingPointBotTeamOneX = 130;
        let startingPointBotTeamOneY = 270;

        let oneT = Math.round(pointsTeam1/100);
        let oneM = Math.round((pointsTeam1%100)/50);
        let oneB = Math.round(pointsTeam1%100%50 /20);

        let restOne = pointsTeam1%100%50%20;

        let twoT = Math.round(pointsTeam2/100);
        let twoM = Math.round((pointsTeam2%100)/50);
        let twoB = Math.round(pointsTeam2%100%50 /20);

        let restTwo = pointsTeam2%100%50%20;

        while(oneT > 0){
            let isFifth = (pointsDrawn.oneT+1) %5 === 0 && pointsDrawn.oneT !== 0;
            if(isFifth){
                drawFifthLine(startingPointTopTeamOneX + (strokeMargin*(pointsDrawn.oneT - 4)), startingPointTopTeamOneY);
            }else{
                drawLine(startingPointTopTeamOneX +(strokeMargin*pointsDrawn.oneT), startingPointTopTeamOneY);
            }
            pointsDrawn.oneT++;
            oneT--;
        }
        while(oneM > 0){
            let numOfCross = Math.floor(pointsDrawn.oneM/2);
            let ltr = pointsDrawn.oneM %2 == 0;

            drawLineCross(startingPointMidTeamOneX + (numOfCross*(crossLegMarginX+ (2*strokeWidth + strokeMargin))),
                startingPointMidTeamOneY - (numOfCross * (2*strokeWidth + strokeMargin)),
                ltr);
            pointsDrawn.oneM++;
            oneM--;
        }
        while(oneB >0){
            let numOfFivePairs = Math.floor(pointsDrawn.oneB/5);
            let isFifth = (pointsDrawn.oneB+1) %5 === 0 && pointsDrawn.oneB !== 0;
            if(isFifth){
                drawFifthLine(startingPointBotTeamOneX + (strokeMargin*(pointsDrawn.oneB - 4)) + numOfFivePairs*strokeMargin, startingPointBotTeamOneY);
            }else{
                drawLine(startingPointBotTeamOneX +(strokeMargin*pointsDrawn.oneB), startingPointBotTeamOneY);
            }
            pointsDrawn.oneB++;
            oneB--;
        }

        while(twoT > 0){
            let isFifth = (pointsDrawn.twoT+1) %5 === 0 && pointsDrawn.twoT !== 0;
            if(isFifth){
                drawFifthLine(startingPointTopTeamOneX + (strokeMargin*(pointsDrawn.twoT - 4)), startingPointTopTeamOneY + teamBoardMargin);
            }else{
                drawLine(startingPointTopTeamOneX  +(strokeMargin*pointsDrawn.twoT), startingPointTopTeamOneY + teamBoardMargin);
            }
            pointsDrawn.twoT++;
            twoT--;
        }
        while(twoM > 0){
            let numOfCross = Math.floor(pointsDrawn.twoM/2);
            let ltr = pointsDrawn.twoM %2 == 0;

            drawLineCross(startingPointMidTeamOneX + (numOfCross*(crossLegMarginX+ (2*strokeWidth + strokeMargin))),
                startingPointMidTeamOneY + teamBoardMargin - (numOfCross * (2*strokeWidth + strokeMargin)),
                ltr);
            pointsDrawn.twoM++;
            twoM--;
        }
        while(twoB >0){
            let numOfFivePairs = Math.floor(pointsDrawn.twoB/5);
            let isFifth = (pointsDrawn.twoB+1) %5 === 0 && pointsDrawn.twoB !== 0;
            if(isFifth){
                drawFifthLine(startingPointBotTeamOneX + (strokeMargin*(pointsDrawn.twoB - 4)) + numOfFivePairs*strokeMargin, startingPointBotTeamOneY + teamBoardMargin);
            }else{
                drawLine(startingPointBotTeamOneX +(strokeMargin*pointsDrawn.twoB), startingPointBotTeamOneY + teamBoardMargin);
            }
            pointsDrawn.twoB++;
            twoB--;
        }

        return {team1: restOne, team2:restTwo, pointsDrawn:pointsDrawn}
    }

    render() {
        this.renderDefaultBoard()
            .then((context) =>{
                const rounds = this.game.rounds;

                let points = calculatePointsPerTeam(this.game);

                const team1 = points.team1.team.name;
                const team2 = points.team2.team.name;

                let pointsTeam1= points.team1.points;
                let pointsTeam2 = points.team2.points;

                let rest = {team1: 0, team2: 0};
                let pointsDrawn = {oneT:0, oneM:0, oneB:0, twoT:0, twoM:0, twoB:0};

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
                    rest = this.drawPoints(pointsPerRoundTeam1, pointsPerRoundTeam2, rest, context, pointsDrawn);
                    pointsTeam1 -= pointsPerRoundTeam1;
                    pointsTeam2 -= pointsPerRoundTeam2;
                })
        });
    }
}

export default DrawGameBoard;
