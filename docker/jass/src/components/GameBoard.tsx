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

    const [team, setTeam] = useState(props.teamNameOne);
    const [points, setPoints] = useState(0);
    const [trumpf, setTrumpf] = useState(trump[0].name);
    const [wiisPoints, setWiisPoints] = useState(0);


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
            <td>{props.round}</td>
        </tr>
        <tr>
            <td><select onChange={(value) => {
                setTeam(value);
            }
            }>

                <optgroup>
                    <option>{props.teamNameOne}</option>
                    <option>{props.teamNameTwo}</option>
                </optgroup>
            </select>
            </td>
        </tr>
        <tr>
            <td>
                <input value={points} type={"number"} onChange={e => setPoints(Number(e.currentTarget.value))}/>
            </td>
        </tr>
        <tr>
            <td>
                <input value={wiisPoints} type={"number"} onChange={e => setWiisPoints(Number(e.currentTarget.value))}/>
            </td>
        </tr>
        <tr>
            <td>
                <select defaultValue={trumpf} onChange={e => setTrumpf(e.currentTarget.value)}>
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
        </tr>
        <tr>
            <td>
                <input value={"Submit round"} type={"button"} onClick={() => {
                    {
                        trump.forEach(trump => {
                            if (trump.name === trumpf) {
                                props.addRound(trump.id, points, team, wiisPoints);
                            }
                        });
                    }
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
    const mockedGame: FullGame = GameMocks[random];

    const [game, setGame] = useState(mockedGame);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        const boardRenderer = new DrawGameBoard(canvasRef, game, jasstafel);
        boardRenderer.render();
    });

    const getNextRoundId = (rounds: Round[]) => {
        if (rounds.length > 0) {
            return rounds[rounds.length - 1].id + 1;
        } else {
            return 0;
        }
    };

    const addRound = (trumpfId: number, points: number, teamName: string, wiisPoints: number) => {
        let teamId = game.teams[0].name === teamName ? game.teams[0].id : game.teams[1].id;
        const rounds = game.rounds;


        const getTeamIdOtherTeam = () => {
            return game.teams[0].id === teamId ? game.teams[1].id : game.teams[0].id;
        };

        let pointsOtherTeam = 0;
        if (points === 157) {
            points = 257;
        } else if (points === 0) {
            pointsOtherTeam = 257;
        } else {
            pointsOtherTeam = 157 - points;
        }
        const pointsPerTeamPerRound: PointsPerTeamPerRound[] = [
            {points: points, wiisPoints: wiisPoints, teamId: teamId},
            {points: pointsOtherTeam, wiisPoints: wiisPoints, teamId: getTeamIdOtherTeam()}];

        const round: Round = {
            id: getNextRoundId(rounds),
            trumpfId: trumpfId,
            pointsPerTeamPerRound: pointsPerTeamPerRound
        };
        game.rounds.push(round);
        setGame(game);
        setRerender(!rerender);
    };

    const HistoryTable = (props: any) => {
        let rounds = props.game.rounds;

        const team1 = props.game.teams[0];
        const team2 = props.game.teams[1];

        return <HistoryWrapper teamNameOne={team1.name}
                               teamNameTwo={team2.name}
                               round={getNextRoundId(rounds) + 1}
                               addRound={addRound}>
            {rounds.map((round: Round, numOfRounds: number) => {
                let trumpf = trump[round.trumpfId];
                let pointsPerTeamPerRound = round.pointsPerTeamPerRound;
                let teamOnePoints = 0;
                let teamTwoPoints = 0;

                console.log(round.trumpfId);
                pointsPerTeamPerRound.map(pointsPerRound => {
                    let teamId = pointsPerRound.teamId;
                    let pointsTeam = pointsPerRound.points * trumpf.multiplier;
                    let wiisPoints = pointsPerRound.wiisPoints * trumpf.multiplier;
                    console.log("points", pointsTeam);
                    console.log("wiis", wiisPoints);


                    let points = pointsTeam + wiisPoints;

                    console.log("points", points)
                    if (teamId === team1.id) {
                        teamOnePoints = points;
                    } else {
                        teamTwoPoints = points;
                    }
                });
                return <HistoryTableRow runde={numOfRounds + 1} teamOnePoints={teamOnePoints}
                                        teamTwoPoints={teamTwoPoints} trump={trumpf.name}/>
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
                        <HistoryTable game={game}/>
                    </div>
                </div>
            </div>
        </div>

    </ViewWrapper>;
}

export default GameBoard;
