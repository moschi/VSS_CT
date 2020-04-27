import * as React from "react";
import {useEffect, useRef} from "react";
import DrawGameBoard from "../classes/DrawGameBoard";
import {FullGame, Round, Trumpf} from "../classes/Game";
import GameMocks from "../classes/GameMocks";
import jasstafel from "../images/jasstafel.jpg";
import ViewWrapper from "./ViewWrapper";

const trump: Trumpf[] = [
    {id: 0, name: "Eichel", multiplier: 1},
    {id: 1, name: "Rose", multiplier: 1},
    {id: 2, name: "Schellen", multiplier: 2},
    {id: 3, name: "Schilten", multiplier: 2},
    {id: 4, name: "ObenAben", multiplier: 3},
    {id: 5, name: "UntenUfen", multiplier: 3}];


const HistoryWrapper = (props: any) => {
    return <table>
        <tbody>
        <tr>
            <th>Runde</th>
            <th>{props.teamNameOne}</th>
            <th>{props.teamNameTwo}</th>
            <th>Trumpf</th>
        </tr>
        {props.children}
        </tbody>
    </table>
};

const HistoryTableRow = (props: any) => {
    return <tr>
        <td>
            <p>{props.runde}</p>
        </td>
        <td>
            <p>
                {props.teamOnePoints}
            </p>
        </td>
        <td>
            <p>
                {props.teamTwoPoints}
            </p>
        </td>
        <td>
            <p>
                {props.trump}
            </p>
        </td>
    </tr>
};

function GameBoard(props: any) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const random = Math.round(Math.random() * 2);
    console.log(random);
    const mockedGame: FullGame = GameMocks[0];

    useEffect(() => {
        const boardRenderer = new DrawGameBoard(canvasRef, mockedGame, jasstafel);
        boardRenderer.render();
    });


    const HistoryTable = () => {
        let rounds = mockedGame.rounds;

        const team1 = mockedGame.teams[0];
        const team2 = mockedGame.teams[1];


        return <HistoryWrapper teamNameOne={team1.name}
                               teamNameTwo={team2.name}>
            {rounds.map((round: Round, numOfRounds: number) => {
                let trumpf = trump[round.trumpfId];
                let pointsPerTeamPerRound = round.pointsPerTeamPerRound;
                let teamOnePoints = 0;
                let teamTwoPoints = 0;
                pointsPerTeamPerRound.map(pointsPerRound => {
                    let teamId = pointsPerRound.teamId;
                    let pointsTeam = pointsPerRound.points * trumpf.multiplier;
                    let wiisPoints = pointsPerRound.wiisPoints * trumpf.multiplier;
                    let points = pointsTeam + wiisPoints;
                    teamId === team1.id ? teamOnePoints = points : teamTwoPoints = points;
                });

                console.log("size", pointsPerTeamPerRound.length);

                if (pointsPerTeamPerRound.length === 0) {
                    return <tr></tr>
                } else {
                    return <HistoryTableRow runde={numOfRounds + 1} teamOnePoints={teamOnePoints}
                                            teamTwoPoints={teamTwoPoints} trump={trumpf.name}/>
                }
            })
            }
        </HistoryWrapper>
    };

    return <ViewWrapper>
        <h1>{props.match.params.id}</h1>
        <div className={"gameBoardWrapper"}>
            <div>
                <canvas ref={canvasRef} width={515} height={720}/>
            </div>
            <div>
                <div className={"gameBoardInnerWrapper"}>
                    <div>
                        <h2>History</h2>
                        <HistoryTable/>
                    </div>
                </div>
            </div>
        </div>

    </ViewWrapper>;
}

export default GameBoard;
