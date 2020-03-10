import {Game} from "./Game";
import {RefObject} from "react";

class DrawGameBoard {

    canvas: RefObject<HTMLCanvasElement>;
    game: Game;
    jasstafel:string;

    constructor(canvas: RefObject<HTMLCanvasElement>, game: Game, jasstafel:string) {
        this.canvas = canvas;
        this.game = game;
        this.jasstafel = jasstafel;
    }

    loadImage(){
        return new Promise((resolve)=>{
            let backgroundImage = new Image(515,720);
            backgroundImage.src = this.jasstafel;
            resolve(backgroundImage);
        })
    }

    renderDefaultBoard() {

        this.loadImage()
            .then((backgroundImage)=>{
            if (this.canvas.current) {
                let context = this.canvas.current.getContext("2d");
                if (context) {
                    // @ts-ignore
                    backgroundImage.onload = function(){
                        // @ts-ignore
                        context.drawImage(backgroundImage, 0, 0);

                        // context.moveTo(0, 0);
                        // context.lineTo(515, 0);
                        // context.lineTo(0, 720);
                        // context.lineTo(515, 720);
                        // context.stroke();
                    };
                } else {
                    console.log("something went wrong");
                    console.log(this.canvas);
                }
            } else {
                console.log("something went wrong");
                console.log(this.canvas);
            }
        })


    }

    render() {
        this.renderDefaultBoard();
    }


}

export default DrawGameBoard;
