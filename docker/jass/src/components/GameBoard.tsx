import * as React from "react";
import {useEffect, useRef, useState} from "react";
import DrawGameBoard from "../classes/DrawGameBoard";
import {FullGame, PointsPerTeamPerRound, Round, Trumpf} from "../classes/Game";
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
        <tr>
            <td><select>
                //todo
                <optgroup>
                    <option>{props.teamNameOne}</option>
                    <option>{props.teamNameTwo}</option>
                </optgroup>
            </select>
            </td>
            <td>
                //todo
                <input type={"number"}/>
            </td>
            <td>
                <select>
                    //todo
                    <optgroup>
                        {
                            trump.map((trumpf: Trumpf) => {
                                return <option>
                                    {trumpf.name}
                                </option>
                            })

                        }
                    </optgroup>
                </select>
            </td>
            <td>
                <input value={"Submit round"} type={"button"} onClick={() => {

                    {props.addRound(0,100,0);}
                }
                }/>
            </td>
        </tr>

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
    const mockedGame: FullGame = GameMocks[random];

    const[game, setGame] = useState(mockedGame);

    useEffect(() => {
        const boardRenderer = new DrawGameBoard(canvasRef, game, jasstafel);
        boardRenderer.render();
    });

    const addRound = (trumpfId: number, points: number, teamId: number) => {
        //TODO add wiispoints
        alert("yeet");

        const rounds = game.rounds;
        console.log(rounds);
        const getNextId = () => {
            if(rounds.length>0){
                return rounds[rounds.length-1].id + 1 ;
            }else{
                return 0;
            }
        };

        const getTeamIdOtherTeam = () =>{
            return game.teams[0].id === teamId ? game.teams[1].id : game.teams[0].id;
        };

        let pointsOtherTeam = 0;
        if(points === 157){
            points = 257;
        }else{
            pointsOtherTeam = 157 -points;
        }
        const pointsPerTeamPerRound: PointsPerTeamPerRound[] = [
            {points: points, wiisPoints: 0, teamId: teamId},
            {points: pointsOtherTeam, wiisPoints: 0, teamId: getTeamIdOtherTeam()}];

        const round: Round = {id: getNextId(), trumpfId: trumpfId, pointsPerTeamPerRound: pointsPerTeamPerRound};
        game.rounds.push(round);
        setGame(game);
        console.log(game);
        //test if does rerender
    };

    const HistoryTable = (props:any) => {
        let rounds = props.game.rounds;

        const team1 = props.game.teams[0];
        const team2 = props.game.teams[1];


        return <HistoryWrapper teamNameOne={team1.name}
                               teamNameTwo={team2.name}
                               addRound={addRound}>
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
                return <HistoryTableRow runde={numOfRounds + 1} teamOnePoints={teamOnePoints}
                                        teamTwoPoints={teamTwoPoints} trump={trumpf.name}/>
            })
            }
        </HistoryWrapper >
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
                        <HistoryTable game={game}/>
                    </div>
                </div>
            </div>
        </div>

    </ViewWrapper>;
}

export default GameBoard;
