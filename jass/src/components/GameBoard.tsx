import * as React from "react";
import {useEffect, useRef} from "react";
import DrawGameBoard from "../classes/DrawGameBoard";
import {Game} from "../classes/Game";
import GameMocks from "../classes/GameMocks";
import jasstafel from "../images/jasstafel.jpg";
import ViewWrapper from "./ViewWrapper";

function GameBoard(props: any) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const mockedGame: Game = GameMocks[0];

    useEffect(() => {
        const boardRenderer = new DrawGameBoard(canvasRef, mockedGame, jasstafel);
        boardRenderer.render();
    });

    return <ViewWrapper>
        <h1>{props.match.params.id}</h1>
        <canvas ref={canvasRef} width={515} height={720}/>
    </ViewWrapper>;
}

export default GameBoard;
